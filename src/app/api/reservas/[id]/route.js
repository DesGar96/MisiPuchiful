import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { accion } = await request.json();

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;

    if (accion === 'cancelar') {
      await pool.query(
        `UPDATE reservas SET estado = 'cancelada', fecha_modificacion = NOW() WHERE id = ? AND usuario_id = ?`,
        [id, usuarioId]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Reserva actualizada correctamente' 
    });

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}