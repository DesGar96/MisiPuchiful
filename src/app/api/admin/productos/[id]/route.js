import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function esAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user_session');
  if (!sessionCookie) return false;
  const sessionData = JSON.parse(sessionCookie.value);
  return sessionData.rol === 'admin';
}

export async function PUT(request, { params }) {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    await pool.query(
      `UPDATE productos SET 
       nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ?, 
       categoria_id = ?, destacado = ?, es_novedad = ?, es_oferta = ?, precio_oferta = ?
       WHERE id = ?`,
      [data.nombre, data.descripcion, data.precio, data.stock, data.imagen, 
       data.categoria_id, data.destacado, data.es_novedad, data.es_oferta, 
       data.precio_oferta, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Producto actualizado correctamente' 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);

    return NextResponse.json({ 
      success: true, 
      message: 'Producto eliminado correctamente' 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}