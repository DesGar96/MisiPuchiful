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

    const [posts] = await pool.query(`
      SELECT * FROM blog_posts 
      ORDER BY fecha_publicacion DESC
    `);

    // Transformar los datos para que usen fecha_creacion en lugar de fecha_publicacion
    const postsTransformados = posts.map(post => ({
      ...post,
      fecha_creacion: post.fecha_publicacion  // Mapear al nombre que espera el frontend
    }));

    return NextResponse.json({ success: true, data: postsTransformados });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const data = await request.json();
    
    const [result] = await pool.query(
      `INSERT INTO blog_posts 
       (titulo, contenido, resumen, imagen, categoria, activo) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.titulo, data.contenido, data.resumen, data.imagen, data.categoria, data.activo ? 1 : 0]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Post creado correctamente',
      id: result.insertId 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}