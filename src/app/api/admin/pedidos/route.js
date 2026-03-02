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

    // Obtener todos los pedidos con información del usuario
    const [pedidos] = await pool.query(`
      SELECT p.*, u.nombre as usuario_nombre, u.email 
      FROM pedidos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha_pedido DESC
    `);

    // Obtener detalles de cada pedido
    for (let pedido of pedidos) {
      const [detalles] = await pool.query(`
        SELECT dp.*, pr.nombre as producto_nombre
        FROM detalle_pedido dp
        JOIN productos pr ON dp.producto_id = pr.id
        WHERE dp.pedido_id = ?
      `, [pedido.id]);
      pedido.detalles = detalles;
    }

    return NextResponse.json({ success: true, data: pedidos });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}