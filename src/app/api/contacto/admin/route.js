import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM contactos 
      ORDER BY fecha_creacion DESC
    `);

    return NextResponse.json({ 
      success: true, 
      data: rows 
    });

  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener los contactos' 
    }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, leido } = await request.json();

    await pool.query(
      'UPDATE contactos SET leido = ? WHERE id = ?',
      [leido, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Estado actualizado' 
    });

  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al actualizar' 
    }, { status: 500 });
  }
}