import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function esAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user_session');
  if (!sessionCookie) return false;
  const sessionData = JSON.parse(sessionCookie.value);
  return sessionData.rol === 'admin';
}

export async function GET() {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    console.log('🔍 Obteniendo reservas para admin...');

    const [reservas] = await pool.query(`
      SELECT 
        r.*,
        u.nombre as usuario_nombre,
        u.email,
        CASE 
          WHEN r.tipo_servicio = 'peluqueria' THEN '🐕 Peluquería'
          WHEN r.tipo_servicio = 'veterinario' THEN '🏥 Veterinario'
        END as servicio_nombre
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC
    `);

    console.log(`✅ Encontradas ${reservas.length} reservas`);

    return NextResponse.json({ success: true, data: reservas });

  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}