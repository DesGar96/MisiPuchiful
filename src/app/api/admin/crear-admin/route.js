import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

async function esAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user_session');
  if (!sessionCookie) return false;
  const sessionData = JSON.parse(sessionCookie.value);
  return sessionData.rol === 'admin';
}

export async function POST(request) {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ 
        success: false, 
        error: 'No autorizado. Solo los administradores pueden crear nuevas cuentas de admin.' 
      }, { status: 403 });
    }

    const { nombre, email, password, telefono, direccion } = await request.json();

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nombre, email y contraseña son obligatorios' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      }, { status: 400 });
    }

    // Verificar si el email ya existe
    const [usuariosExistentes] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ya existe un usuario con ese email' 
      }, { status: 400 });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo administrador
    const [result] = await pool.query(
      `INSERT INTO usuarios 
       (nombre, email, password, telefono, direccion, rol, activo, fecha_registro) 
       VALUES (?, ?, ?, ?, ?, 'admin', 1, NOW())`,
      [nombre, email, hashedPassword, telefono || null, direccion || null]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Administrador creado correctamente',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error al crear administrador:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}