import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;

    const [usuarios] = await pool.query(
      'SELECT id, nombre, email, telefono, direccion, rol FROM usuarios WHERE id = ?',
      [usuarioId]
    );

    if (usuarios.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: usuarios[0] 
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener los datos del perfil' 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;
    const { nombre, telefono, direccion } = await request.json();

    await pool.query(
      'UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?',
      [nombre, telefono || null, direccion || null, usuarioId]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Perfil actualizado correctamente' 
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al actualizar el perfil' 
    }, { status: 500 });
  }
}