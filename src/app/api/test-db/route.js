import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const resultados = {
    paso1_conexion: false,
    paso2_tablas: false,
    paso3_datos: false,
    errores: []
  };

  try {
    // PASO 1: Probar conexión
    const connection = await pool.getConnection();
    resultados.paso1_conexion = true;
    
    // PASO 2: Verificar tablas
    const [tablas] = await connection.query('SHOW TABLES');
    resultados.tablas = tablas.map(t => Object.values(t)[0]);
    
    // PASO 3: Verificar productos
    const [productos] = await connection.query('SELECT COUNT(*) as total FROM productos');
    resultados.total_productos = productos[0].total;
    
    if (resultados.total_productos > 0) {
      const [primeros] = await connection.query('SELECT id, nombre, precio FROM productos LIMIT 3');
      resultados.primeros_productos = primeros;
      resultados.paso3_datos = true;
    }
    
    connection.release();
    
    return NextResponse.json({ 
      success: true,
      message: '✅ Conexión exitosa',
      ...resultados
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      ...resultados
    }, { status: 500 });
  }
}