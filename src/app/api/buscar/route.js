import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    console.log('🔍 Búsqueda:', query);

    if (!query || query.trim() === '') {
      return NextResponse.json({ 
        success: true, 
        data: [] 
      });
    }

    const searchTerm = `%${query}%`;

    // Verificar que la tabla productos existe
    const [tablas] = await pool.query("SHOW TABLES LIKE 'productos'");
    if (tablas.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [] 
      });
    }

    // Buscar en productos
    const [productos] = await pool.query(
      `SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen,
        p.es_oferta,
        p.es_novedad,
        c.nombre as categoria_nombre,
        'producto' as tipo
      FROM productos p
      LEFT JOIN categoria_producto c ON p.categoria_id = c.id
      WHERE p.nombre LIKE ? OR p.descripcion LIKE ?
      ORDER BY 
        CASE 
          WHEN p.nombre LIKE ? THEN 1
          WHEN p.descripcion LIKE ? THEN 2
          ELSE 3
        END,
        p.nombre
      LIMIT 20`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    console.log('📦 Productos encontrados:', productos.length);

    // Verificar que la tabla blog_posts existe
    const [tablasBlog] = await pool.query("SHOW TABLES LIKE 'blog_posts'");
    let blogPosts = [];
    
    if (tablasBlog.length > 0) {
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
        ORDER BY fecha_creacion DESC
        LIMIT 10`,
        [searchTerm, searchTerm, searchTerm]
      );
      console.log('📝 Blog posts encontrados:', blogPosts.length);
    }

    // Combinar resultados
    const resultados = [...productos, ...blogPosts];

    return NextResponse.json({ 
      success: true, 
      data: resultados,
      query: query
    });

  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}