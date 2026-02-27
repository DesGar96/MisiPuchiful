import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const [rows] = await pool.query(`
      SELECT 
        b.*,
        u.nombre as autor_nombre
      FROM blog_posts b
      LEFT JOIN usuarios u ON b.autor_id = u.id
      WHERE b.id = ? AND b.activo = 1
    `, [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post no encontrado' 
      }, { status: 404 });
    }
    
    const post = rows[0];
    
    return NextResponse.json({ 
      success: true, 
      data: {
        id: post.id,
        titulo: post.título,
        contenido: post.contenido,
        resumen: post.resumen || post.contenido.substring(0, 150) + '...',
        imagen: post.imagen || '/imagenes/blog-placeholder.jpg',
        categoria: 'General',
        fecha_creacion: post.fecha_publicacion,
        autor: post.autor_nombre || 'Misifú y Puchi'
      }
    });
    
  } catch (error) {
    console.error('Error al obtener post:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}