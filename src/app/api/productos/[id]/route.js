import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    console.log('🔍 Buscando producto con ID:', id);

    // Verificar que el ID es válido
    if (!id || isNaN(id)) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID de producto no válido' 
      }, { status: 400 });
    }

    // Obtener datos del producto
    const [productos] = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categoria_producto c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id]);
    
    console.log('📦 Producto encontrado:', productos.length > 0 ? 'Sí' : 'No');
    
    if (productos.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Producto no encontrado' 
      }, { status: 404 });
    }
    
    // Obtener reseñas del producto - IMPORTANTE: usar "resenas" (sin tilde)
    const [resenas] = await pool.query(`
      SELECT * FROM resenas 
      WHERE producto_id = ? 
      ORDER BY fecha DESC
    `, [id]);
    
    console.log('⭐ Reseñas encontradas:', resenas.length);
    
    // Calcular puntuación media
    const puntuacionMedia = resenas.length > 0 
      ? resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length 
      : 0;
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...productos[0],
        resenas: resenas,  // IMPORTANTE: usar "resenas" (sin tilde)
        puntuacion_media: puntuacionMedia,
        total_resenas: resenas.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error en API de producto:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error interno del servidor'
    }, { status: 500 });
  }
}