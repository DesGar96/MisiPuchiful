import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { nombre, email, telefono, mensaje } = await request.json();

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nombre, email y mensaje son obligatorios' 
      }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email no válido' 
      }, { status: 400 });
    }

    // Insertar en la base de datos
    const [result] = await pool.query(
      'INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)',
      [nombre, email, telefono || null, mensaje]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Mensaje enviado correctamente',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error al guardar contacto:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al procesar la solicitud' 
    }, { status: 500 });
  }
}