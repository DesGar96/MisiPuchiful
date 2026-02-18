import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validar que llegaron los datos
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son obligatorios' },
        { status: 400 }
      );
    }
    
    // Buscar usuario por email
    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    
    // Si no existe el usuario
    if (usuarios.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    const usuario = usuarios[0];
    
    // COMPARAR CONTRASEÑA USANDO BCRYPT
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // No enviar la contraseña en la respuesta
    const { password: _, ...usuarioSinPassword } = usuario;
    
    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: usuarioSinPassword
    });
    
    // Establecer cookie simple
    response.cookies.set('user_session', JSON.stringify({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol
    }), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { success: false, error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}