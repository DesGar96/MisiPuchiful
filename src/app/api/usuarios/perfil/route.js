import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

// Helper para obtener usuario de la cookie
function getUserFromSession(request) {
  const session = request.cookies.get('user_session');
  if (!session) return null;
  
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

// GET - Obtener datos del perfil
export async function GET(request) {
  try {
    const user = getUserFromSession(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }
    
    const [rows] = await pool.query(
      'SELECT id, nombre, email, telefono, direccion, rol, fecha_registro FROM usuarios WHERE id = ?',
      [user.id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: rows[0]
    });
    
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar datos del perfil
export async function PUT(request) {
  try {
    const user = getUserFromSession(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }
    
    const { nombre, telefono, direccion } = await request.json();
    
    // Validaciones
    if (!nombre) {
      return NextResponse.json(
        { success: false, error: 'El nombre es obligatorio' },
        { status: 400 }
      );
    }
    
    // Actualizar usuario
    await pool.query(
      'UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?',
      [nombre, telefono || null, direccion || null, user.id]
    );
    
    // Actualizar la cookie con el nuevo nombre
    const updatedUser = { ...user, nombre };
    const response = NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente'
    });
    
    response.cookies.set('user_session', JSON.stringify(updatedUser), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}