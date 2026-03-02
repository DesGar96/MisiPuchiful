import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;

    const [reservas] = await pool.query(`
      SELECT 
        r.*,
        CASE 
          WHEN r.tipo_servicio = 'peluqueria' THEN '🐕 Peluquería'
          WHEN r.tipo_servicio = 'veterinario' THEN '🏥 Veterinario'
        END as servicio_nombre,
        CASE 
          WHEN r.tipo_mascota = 'perro' THEN '🐕 Perro'
          WHEN r.tipo_mascota = 'gato' THEN '🐈 Gato'
          WHEN r.tipo_mascota = 'otro' THEN '🐾 Otras especies'
        END as tipo_mascota_nombre
      FROM reservas r
      WHERE r.usuario_id = ?
      ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC
    `, [usuarioId]);

    return NextResponse.json({ success: true, data: reservas });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}