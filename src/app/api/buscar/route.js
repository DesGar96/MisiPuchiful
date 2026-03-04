import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    console.log('🔍 Búsqueda recibida:', query);

    if (!query || query.trim() === '') {
      return NextResponse.json({ 
        success: true, 
        data: [] 
      });
    }

    const searchTerm = `%${query}%`;

    // Verificar que la tabla productos existe
    const [productosTable] = await pool.query("SHOW TABLES LIKE 'productos'");
    let productos = [];
    
    if (productosTable.length > 0) {
      try {
        // Buscar en productos
        [productos] = await pool.query(
          `SELECT 
            p.id,
            p.nombre,
            p.descripcion,
            p.precio,
            p.imagen,
            p.es_oferta,
            p.es_novedad,
            p.precio_oferta,
            'producto' as tipo
          FROM productos p
          WHERE p.nombre LIKE ? OR p.descripcion LIKE ?
          LIMIT 20`,
          [searchTerm, searchTerm]
        );
        console.log('📦 Productos encontrados:', productos.length);
      } catch (error) {
        console.error('Error en consulta de productos:', error);
      }
    }

    // Verificar que la tabla blog_posts existe
    const [blogTable] = await pool.query("SHOW TABLES LIKE 'blog_posts'");
    let blogPosts = [];
    
    if (blogTable.length > 0) {
      try {
        // Buscar en blog posts
        [blogPosts] = await pool.query(
          `SELECT 
            id,
            titulo as nombre,
            resumen as descripcion,
            imagen,
            'blog' as tipo,
            fecha_creacion
          FROM blog_posts
          WHERE titulo LIKE ? OR contenido LIKE ? OR resumen LIKE ?
          LIMIT 10`,
          [searchTerm, searchTerm, searchTerm]
        );
        console.log('📝 Blog posts encontrados:', blogPosts.length);
      } catch (error) {
        console.error('Error en consulta de blog:', error);
      }
    }

    // Combinar resultados
    const resultados = [...productos, ...blogPosts];

    return NextResponse.json({ 
      success: true, 
      data: resultados,
      query: query,
      total: resultados.length
    });

  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}