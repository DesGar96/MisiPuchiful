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

    console.log('🔍 Buscando reseñas para usuario:', usuarioId);

    // Obtener reseñas escritas por el usuario (incluyendo info de edición)
    const [resenas] = await pool.query(`
      SELECT r.*, p.nombre as producto_nombre, p.imagen as producto_imagen
      FROM resenas r
      JOIN productos p ON r.producto_id = p.id
      WHERE r.usuario_id = ?
      ORDER BY r.fecha DESC
    `, [usuarioId]);

    // Obtener productos comprados (todos, para saber si puede reseñar)
    const [compras] = await pool.query(`
      SELECT DISTINCT pc.producto_id, p.nombre as producto_nombre, p.imagen as producto_imagen,
             MAX(pc.fecha_compra) as fecha_compra,
             CASE WHEN r.id IS NULL THEN TRUE ELSE FALSE END as puede_reseniar,
             CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END as ya_reseniado,
             r.id as resena_id, r.puntuacion, r.comentario, r.fecha as fecha_resena
      FROM productos_comprados pc
      JOIN productos p ON pc.producto_id = p.id
      LEFT JOIN resenas r ON pc.producto_id = r.producto_id AND r.usuario_id = pc.usuario_id
      WHERE pc.usuario_id = ?
      GROUP BY pc.producto_id
      ORDER BY fecha_compra DESC
    `, [usuarioId]);

    // Separar en pendientes (comprado pero no reseñado) y escritas (ya reseñado)
    const pendientes = compras.filter(c => !c.ya_reseniado);
    const escritas = resenas; // Ya tenemos las reseñas completas

    console.log('📊 Reseñas escritas:', escritas.length);
    console.log('📊 Productos comprados totales:', compras.length);
    console.log('📊 Pendientes de reseñar:', pendientes.length);

    return NextResponse.json({ 
      success: true, 
      data: {
        escritas: escritas,
        pendientes: pendientes
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener reseñas:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}