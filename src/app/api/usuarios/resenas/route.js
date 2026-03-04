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

    // Obtener reseñas escritas por el usuario (con datos del producto)
    const [resenas] = await pool.query(`
      SELECT r.*, 
             p.nombre as producto_nombre, 
             p.imagen as producto_imagen,
             p.precio,
             p.precio_oferta,
             p.es_oferta,
             p.es_novedad
      FROM resenas r
      JOIN productos p ON r.producto_id = p.id
      WHERE r.usuario_id = ?
      ORDER BY r.fecha DESC
    `, [usuarioId]);

    // Obtener productos pendientes de reseñar (con datos del producto)
    const [pendientes] = await pool.query(`
      SELECT pc.*, 
             p.nombre as producto_nombre, 
             p.imagen as producto_imagen,
             p.precio,
             p.precio_oferta,
             p.es_oferta,
             p.es_novedad
      FROM productos_comprados pc
      JOIN productos p ON pc.producto_id = p.id
      WHERE pc.usuario_id = ? AND pc.puede_reseniar = TRUE
    `, [usuarioId]);

    console.log('📊 Reseñas escritas:', resenas.length);
    console.log('📊 Reseñas pendientes:', pendientes.length);

    return NextResponse.json({ 
      success: true, 
      data: {
        escritas: resenas,
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