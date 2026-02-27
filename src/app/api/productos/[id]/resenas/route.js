import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { puntuacion, comentario } = await request.json();
    
    // Validar datos
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return NextResponse.json({ 
        success: false, 
        error: 'La puntuación debe ser entre 1 y 5' 
      }, { status: 400 });
    }
    
    // Obtener usuario de la cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    let usuarioId = null;
    let usuarioNombre = 'Usuario Anónimo';
    
    if (sessionCookie) {
      const sessionData = JSON.parse(sessionCookie.value);
      usuarioId = sessionData.id;
      usuarioNombre = sessionData.nombre;
    }
    
    // Insertar reseña
    const [result] = await pool.query(
      'INSERT INTO reseñas (producto_id, usuario_id, usuario_nombre, puntuacion, comentario) VALUES (?, ?, ?, ?, ?)',
      [id, usuarioId, usuarioNombre, puntuacion, comentario]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Reseña añadida correctamente',
      id: result.insertId
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}