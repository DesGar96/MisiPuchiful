import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        success: false, 
        error: 'Debes iniciar sesión para reservar' 
      }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;

    const { 
      tipo_servicio, 
      tipo_mascota,
      fecha, 
      hora, 
      mascota_nombre, 
      observaciones 
    } = await request.json();

    // Validar que la fecha no sea hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaSeleccionada = new Date(fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada <= hoy) {
      return NextResponse.json({ 
        success: false, 
        error: 'No puedes reservar para hoy. Elige una fecha a partir de mañana.' 
      }, { status: 400 });
    }

    // Calcular hora_fin según duración
    const duracion = tipo_servicio === 'peluqueria' ? 2 : 1;
    const horaFin = calcularHoraFin(hora, duracion);

    // Verificar disponibilidad
    const [conflictos] = await pool.query(
      `SELECT id FROM reservas 
       WHERE fecha_reserva = ? AND tipo_servicio = ? 
       AND hora_reserva < ? AND hora_fin > ? 
       AND estado NOT IN ('cancelada', 'completada')`,
      [fecha, tipo_servicio, horaFin, hora]
    );

    if (conflictos.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'La hora seleccionada no está disponible' 
      }, { status: 400 });
    }

    // Crear la reserva
    const [result] = await pool.query(
      `INSERT INTO reservas 
       (usuario_id, tipo_servicio, tipo_mascota, fecha_reserva, hora_reserva, hora_fin, 
        mascota_nombre, observaciones, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
      [usuarioId, tipo_servicio, tipo_mascota, fecha, hora, horaFin, 
       mascota_nombre, observaciones]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Reserva creada correctamente',
      reservaId: result.insertId 
    });

  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

function calcularHoraFin(horaInicio, duracion) {
  const [h, m] = horaInicio.split(':').map(Number);
  const fecha = new Date();
  fecha.setHours(h + duracion, m, 0);
  return fecha.toTimeString().slice(0, 5);
}