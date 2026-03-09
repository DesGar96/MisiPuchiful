import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { postId, emoji } = await request.json();
    
    console.log('API reaccion - Recibido:', { postId, emoji });

    // Validar datos
    if (!postId || !emoji) {
      return NextResponse.json({ 
        success: false, 
        error: 'Faltan datos' 
      }, { status: 400 });
    }

    // Obtener o crear ID de sesión
    const cookieStore = await cookies();
    let sesionId = cookieStore.get('sesion_blog')?.value;
    let crearCookie = false;

    if (!sesionId) {
      sesionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      crearCookie = true;
    }

    // Verificar si el usuario ya reaccionó
    const [reaccionesExistentes] = await pool.query(
      'SELECT id FROM blog_reacciones WHERE post_id = ? AND emoji = ? AND sesion_id = ?',
      [postId, emoji, sesionId]
    );

    console.log('Reacciones existentes:', reaccionesExistentes);

    // Obtener el post para actualizar sus reacciones
    const [post] = await pool.query('SELECT reacciones FROM blog_posts WHERE id = ?', [postId]);
    
    if (post.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post no encontrado' 
      }, { status: 404 });
    }

    // Inicializar/parsear reacciones
    let reacciones = {
      "👍": 0, "❤️": 0, "😄": 0, "😮": 0
    };

    if (post[0].reacciones) {
      try {
        const parsed = typeof post[0].reacciones === 'string' 
          ? JSON.parse(post[0].reacciones) 
          : post[0].reacciones;
        
        reacciones = {
          ...reacciones,
          ...parsed
        };
      } catch (e) {
        console.log('Error parseando reacciones, usando valores por defecto');
      }
    }

    if (reaccionesExistentes.length > 0) {
      // YA REACCIONÓ -> QUITAR REACCIÓN
      console.log('Quitando reacción');
      
      await pool.query(
        'DELETE FROM blog_reacciones WHERE id = ?',
        [reaccionesExistentes[0].id]
      );
      
      reacciones[emoji] = Math.max(0, (reacciones[emoji] || 0) - 1);
      
    } else {
      // NO REACCIONÓ -> AÑADIR REACCIÓN
      console.log('Añadiendo reacción');
      
      await pool.query(
        'INSERT INTO blog_reacciones (post_id, emoji, sesion_id) VALUES (?, ?, ?)',
        [postId, emoji, sesionId]
      );
      
      reacciones[emoji] = (reacciones[emoji] || 0) + 1;
    }

    console.log('Guardando reacciones:', reacciones);

    // Guardar en BBDD
    await pool.query(
      'UPDATE blog_posts SET reacciones = ? WHERE id = ?',
      [JSON.stringify(reacciones), postId]
    );

    // Crear respuesta
    const response = NextResponse.json({ 
      success: true, 
      reacciones 
    });

    // Si creamos una nueva cookie, la enviamos
    if (crearCookie) {
      response.cookies.set('sesion_blog', sesionId, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        httpOnly: true,
        sameSite: 'lax'
      });
    }

    return response;

  } catch (error) {
    console.error('Error detallado en API reacciones:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}