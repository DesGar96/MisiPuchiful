import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, telefono, nuevaPassword } = await request.json();

    // Verificar que el usuario existe con ese email y teléfono
    const [usuarios] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? AND telefono = ?',
      [email, telefono]
    );

    if (usuarios.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No se encontró un usuario con esos datos'
      }, { status: 404 });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

    // Actualizar la contraseña
    await pool.query(
      'UPDATE usuarios SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    return NextResponse.json({
      success: false,
      error: 'Error en el servidor'
    }, { status: 500 });
  }
}