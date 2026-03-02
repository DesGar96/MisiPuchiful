import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Verificar si el usuario es admin
async function esAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user_session');
  if (!sessionCookie) return false;
  const sessionData = JSON.parse(sessionCookie.value);
  return sessionData.rol === 'admin';
}

export async function GET() {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const [productos] = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categoria_producto c ON p.categoria_id = c.id
      ORDER BY p.id DESC
    `);

    return NextResponse.json({ success: true, data: productos });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const data = await request.json();
    
    const [result] = await pool.query(
      `INSERT INTO productos 
       (nombre, descripcion, precio, stock, imagen, categoria_id, destacado, es_novedad, es_oferta, precio_oferta) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.nombre, data.descripcion, data.precio, data.stock, data.imagen, 
       data.categoria_id, data.destacado || 0, data.es_novedad || 0, 
       data.es_oferta || 0, data.precio_oferta || null]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Producto creado correctamente',
      id: result.insertId 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}