import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    const tipoServicio = searchParams.get('tipo_servicio');

    console.log('📅 Verificando disponibilidad para:', { fecha, tipoServicio });

    if (!fecha || !tipoServicio) {
      return NextResponse.json({ 
        success: false, 
        error: 'Faltan parámetros' 
      }, { status: 400 });
    }

    // Duración según tipo de servicio
    const duracion = tipoServicio === 'peluqueria' ? 2 : 1;

    // Horarios base
    const horariosBase = [
      '09:00', '10:00', '11:00', '12:00', 
      '16:00', '17:00', '18:00', '19:00'
    ];
    
    // Obtener reservas existentes para esa fecha y tipo de servicio
    const [reservas] = await pool.query(
      `SELECT hora_reserva, hora_fin FROM reservas 
       WHERE fecha_reserva = ? AND tipo_servicio = ? 
       AND estado NOT IN ('cancelada', 'completada')`,
      [fecha, tipoServicio]
    );

    console.log('📊 Reservas existentes:', reservas);

    // Calcular horarios disponibles
    const horariosDisponibles = horariosBase.filter(hora => {
      const horaInicio = hora;
      const horaFin = calcularHoraFin(hora, duracion);
      
      const ocupado = reservas.some(reserva => {
        const reservaInicio = reserva.hora_reserva.substring(0, 5);
        const reservaFin = reserva.hora_fin.substring(0, 5);
        
        return (
          (horaInicio >= reservaInicio && horaInicio < reservaFin) ||
          (horaFin > reservaInicio && horaFin <= reservaFin) ||
          (horaInicio <= reservaInicio && horaFin >= reservaFin)
        );
      });
      
      return !ocupado;
    });

    return NextResponse.json({ 
      success: true, 
      horarios: horariosDisponibles 
    });

  } catch (error) {
    console.error('❌ Error en API de disponibilidad:', error);
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