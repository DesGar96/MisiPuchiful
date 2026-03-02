import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [servicios] = await pool.query(
      'SELECT * FROM servicios WHERE activo = TRUE ORDER BY tipo, nombre'
    );
    return NextResponse.json({ success: true, data: servicios });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}