import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json();
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }
    
    // Verificar si el email ya existe en la base de datos
    const [existentes] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );
    
    if (existentes.length > 0) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }
    
    // Hashear la contraseña con bcrypt
    const saltRounds = 10; // Número de rondas de sal (recomendado: 10-12)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('🔐 Contraseña hasheada correctamente');
    
    // Insertar nuevo usuario en la base de datos CON LA CONTRASEÑA HASHEDA
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, 'usuario']
    );
    
    console.log('✅ Usuario registrado con ID:', result.insertId);
    
    return NextResponse.json({
      success: true,
      message: 'Usuario registrado correctamente',
      userId: result.insertId
    });
    
  } catch (error) {
    console.error('❌ Error en registro:', error);
    
    // Manejar errores específicos de MySQL
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'No se pudo conectar a la base de datos' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error en el servidor al registrar el usuario' },
      { status: 500 }
    );
  }
}