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

export async function PATCH(request, { params }) {
  try {
    if (!await esAdmin()) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const { estado } = await request.json();

    // Validar que el estado sea válido
    const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Estado no válido' 
      }, { status: 400 });
    }

    await pool.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Estado actualizado correctamente' 
    });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}