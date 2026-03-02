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

export async function PUT(request, { params }) {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    await pool.query(
      `UPDATE blog_posts SET 
       titulo = ?, contenido = ?, resumen = ?, imagen = ?, categoria = ?, activo = ?
       WHERE id = ?`,
      [data.titulo, data.contenido, data.resumen, data.imagen, data.categoria, data.activo ? 1 : 0, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Post actualizado correctamente' 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    await pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);

    return NextResponse.json({ 
      success: true, 
      message: 'Post eliminado correctamente' 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}