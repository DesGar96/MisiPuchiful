import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { puntuacion, comentario, editando } = await request.json();
    
    console.log('📝 Recibida petición de reseña:', { productoId: id, puntuacion, comentario, editando });
    
    // Validar datos
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return NextResponse.json({ 
        success: false, 
        error: 'La puntuación debe ser entre 1 y 5' 
      }, { status: 400 });
    }
    
    if (!comentario || comentario.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'El comentario no puede estar vacío' 
      }, { status: 400 });
    }
    
    // Obtener usuario de la cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        success: false, 
        error: 'Debes iniciar sesión para dejar una reseña' 
      }, { status: 401 });
    }
    
    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;
    const usuarioNombre = sessionData.nombre;
    
    console.log('👤 Usuario:', { usuarioId, usuarioNombre });
    
    // Verificar que el producto existe
    const [productos] = await pool.query(
      'SELECT id FROM productos WHERE id = ?',
      [id]
    );
    
    if (productos.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'El producto no existe' 
      }, { status: 404 });
    }
    
    // Verificar si el usuario ya tiene una reseña para este producto
    const [resenasExistentes] = await pool.query(
      `SELECT * FROM resenas 
       WHERE usuario_id = ? AND producto_id = ?`,
      [usuarioId, id]
    );
    
    console.log('⭐ Reseñas existentes:', resenasExistentes.length);
    
    // SI ESTÁ EDITANDO UNA RESEÑA EXISTENTE
    if (editando && resenasExistentes.length > 0) {
      const resenaExistente = resenasExistentes[0];
      
      // Actualizar la reseña existente
      await pool.query(
        `UPDATE resenas 
         SET puntuacion = ?, comentario = ?, editada = TRUE, fecha_edicion = NOW()
         WHERE id = ?`,
        [puntuacion, comentario, resenaExistente.id]
      );
      
      console.log('✏️ Reseña actualizada con ID:', resenaExistente.id);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Reseña actualizada correctamente',
        id: resenaExistente.id,
        editada: true
      });
    }
    
    // SI ES UNA RESEÑA NUEVA
    if (resenasExistentes.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ya has reseñado este producto. Puedes editar tu reseña existente.' 
      }, { status: 400 });
    }
    
    // Verificar que el usuario ha comprado este producto
    const [compras] = await pool.query(
      `SELECT * FROM productos_comprados 
       WHERE usuario_id = ? AND producto_id = ?`,
      [usuarioId, id]
    );
    
    console.log('🛒 Compras encontradas:', compras.length);
    
    if (compras.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Solo puedes reseñar productos que hayas comprado' 
      }, { status: 403 });
    }
    
    // Insertar nueva reseña
    const [result] = await pool.query(
      `INSERT INTO resenas (producto_id, usuario_id, usuario_nombre, puntuacion, comentario, fecha) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [id, usuarioId, usuarioNombre, puntuacion, comentario]
    );
    
    console.log('✅ Reseña insertada con ID:', result.insertId);
    
    // Marcar el producto como ya reseñado (aunque esto ya no es necesario porque controlamos por existencia)
    await pool.query(
      `UPDATE productos_comprados SET puede_reseniar = FALSE 
       WHERE usuario_id = ? AND producto_id = ?`,
      [usuarioId, id]
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Reseña añadida correctamente',
      id: result.insertId,
      editada: false
    });
    
  } catch (error) {
    console.error('❌ Error en API de reseñas:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error interno del servidor'
    }, { status: 500 });
  }
}