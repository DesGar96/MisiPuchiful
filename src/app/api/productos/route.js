import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const tipo = searchParams.get('tipo'); // 'perros', 'gatos', 'otras'

    let query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categoria_producto c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (categoria && categoria !== 'todos') {
      query += ` AND c.nombre = ?`;
      params.push(categoria);
    }
    
    // Filtro por tipo (perros/gatos/otras) basado en el nombre del producto o descripción
    if (tipo && tipo !== 'todos') {
      if (tipo === 'perros') {
        query += ` AND (p.nombre LIKE '%perro%' OR p.nombre LIKE '%perros%' OR p.descripcion LIKE '%perro%' OR p.descripcion LIKE '%perros%')`;
      } else if (tipo === 'gatos') {
        query += ` AND (p.nombre LIKE '%gato%' OR p.nombre LIKE '%gatos%' OR p.descripcion LIKE '%gato%' OR p.descripcion LIKE '%gatos%')`;
      } else if (tipo === 'otras') {
        query += ` AND NOT (p.nombre LIKE '%perro%' OR p.nombre LIKE '%perros%' OR p.nombre LIKE '%gato%' OR p.nombre LIKE '%gatos%' OR p.descripcion LIKE '%perro%' OR p.descripcion LIKE '%perros%' OR p.descripcion LIKE '%gato%' OR p.descripcion LIKE '%gatos%')`;
      }
    }
    
    query += ` ORDER BY p.fecha_creacion DESC`;
    
    const [rows] = await pool.query(query, params);
    
    return NextResponse.json({ 
      success: true, 
      data: rows 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}