import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;

    // Obtener todos los pedidos del usuario
    const [pedidos] = await pool.query(`
      SELECT * FROM pedidos
      WHERE usuario_id = ?
      ORDER BY fecha_pedido DESC
    `, [usuarioId]);

    // Obtener detalles de cada pedido
    for (let pedido of pedidos) {
      const [detalles] = await pool.query(`
        SELECT dp.*, pr.nombre as producto_nombre, pr.imagen as producto_imagen
        FROM detalle_pedido dp
        JOIN productos pr ON dp.producto_id = pr.id
        WHERE dp.pedido_id = ?
      `, [pedido.id]);
      pedido.detalles = detalles;
    }

    return NextResponse.json({ 
      success: true, 
      data: pedidos 
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}