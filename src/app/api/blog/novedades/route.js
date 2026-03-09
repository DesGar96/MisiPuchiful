import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sesionId = cookieStore.get('sesion_blog')?.value;

    // Obtener todos los posts activos
    const [rows] = await pool.query(`
      SELECT 
        b.*,
        u.nombre as autor_nombre
      FROM blog_posts b
      LEFT JOIN usuarios u ON b.autor_id = u.id
      WHERE b.activo = 1
      ORDER BY b.fecha_publicacion DESC
    `);

    let reaccionesUsuario = {};
    if (sesionId) {
      const [reacciones] = await pool.query(
        'SELECT post_id, emoji FROM blog_reacciones WHERE sesion_id = ?',
        [sesionId]
      );
      
      reacciones.forEach(r => {
        if (!reaccionesUsuario[r.post_id]) {
          reaccionesUsuario[r.post_id] = {};
        }
        reaccionesUsuario[r.post_id][r.emoji] = true;
      });
    }

    const posts = rows.map(post => {
      let reaccionesPost = {
        "👍": 0, "❤️": 0, "😄": 0, "😮": 0
      };
      
      try {
        if (post.reacciones) {
          const parsed = typeof post.reacciones === 'string' 
            ? JSON.parse(post.reacciones) 
            : post.reacciones;
          reaccionesPost = {
            ...reaccionesPost,
            ...parsed
          };
        }
      } catch (e) {
        console.log('Error parseando reacciones para post', post.id);
      }

      return {
        id: post.id,
        titulo: post.titulo,
        contenido: post.contenido,
        resumen: post.resumen || (post.contenido ? post.contenido.substring(0, 150) + '...' : ''),
        imagen: post.imagen || '/imagenes/blog-placeholder.jpg',
        categoria: post.categoria,
        fecha_creacion: post.fecha_publicacion,
        autor: post.autor_nombre || 'Misifú y Puchi',
        reacciones: reaccionesPost,
        misReacciones: reaccionesUsuario[post.id] || {},
        destacado: post.destacado === 1 || post.destacado === true  
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: posts 
    });

  } catch (error) {
    console.error('Error al obtener posts:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}