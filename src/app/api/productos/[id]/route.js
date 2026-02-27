import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Obtener datos del producto
    const [productos] = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categoria_producto c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id]);
    
    if (productos.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Producto no encontrado' 
      }, { status: 404 });
    }
    
    // Obtener reseñas del producto
    const [reseñas] = await pool.query(`
      SELECT * FROM reseñas 
      WHERE producto_id = ? 
      ORDER BY fecha DESC
    `, [id]);
    
    // Calcular puntuación media
    const puntuacionMedia = reseñas.length > 0 
      ? reseñas.reduce((acc, r) => acc + r.puntuacion, 0) / reseñas.length 
      : 0;
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...productos[0],
        reseñas,
        puntuacion_media: puntuacionMedia,
        total_reseñas: reseñas.length
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}