import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    let usuarioId = null;
    let esInvitado = false;
    
    const { items, total, direccion, telefono, email, observaciones, metodoPago, esInvitado: invitado } = await request.json();

    // Validar datos
    if (!items || items.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'El carrito está vacío' 
      }, { status: 400 });
    }

    if (!direccion.tipoVia || !direccion.nombreVia || !direccion.numeroVia || !direccion.codigoPostal || !direccion.ciudad) {
      return NextResponse.json({ 
        success: false, 
        error: 'La dirección de envío es obligatoria' 
      }, { status: 400 });
    }

    // Construir dirección completa
    const direccionCompleta = `${direccion.tipoVia} ${direccion.nombreVia}, nº ${direccion.numeroVia}${direccion.piso ? ', ' + direccion.piso : ''}, ${direccion.codigoPostal} ${direccion.ciudad}`;

    // Si es invitado, crear usuario temporal
    if (invitado) {
      // Buscar si ya existe un usuario con ese email como invitado
      const [usuariosExistentes] = await pool.query(
        'SELECT id FROM usuarios WHERE email = ? AND es_invitado = TRUE',
        [email]
      );

      if (usuariosExistentes.length > 0) {
        usuarioId = usuariosExistentes[0].id;
      } else {
        // Crear nuevo usuario invitado
        const [result] = await pool.query(
          `INSERT INTO usuarios (nombre, email, telefono, es_invitado, activo) 
           VALUES (?, ?, ?, TRUE, TRUE)`,
          ['Invitado', email, telefono]
        );
        usuarioId = result.insertId;
      }
      esInvitado = true;
    } else if (sessionCookie) {
      const sessionData = JSON.parse(sessionCookie.value);
      usuarioId = sessionData.id;
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Debes iniciar sesión o registrarte como invitado' 
      }, { status: 401 });
    }

    // Iniciar transacción
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Crear el pedido
      const [pedidoResult] = await connection.query(
        `INSERT INTO pedidos 
         (usuario_id, total, direccion_envio, tipo_via, nombre_via, numero_via, piso, observaciones, metodo_pago, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          usuarioId, 
          total, 
          direccionCompleta,
          direccion.tipoVia,
          direccion.nombreVia,
          direccion.numeroVia,
          direccion.piso || null,
          observaciones || null,
          metodoPago,
          'pendiente'
        ]
      );

      const pedidoId = pedidoResult.insertId;

      // Insertar detalles del pedido y actualizar stock
      for (const item of items) {
        await connection.query(
          `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario) 
           VALUES (?, ?, ?, ?)`,
          [pedidoId, item.id, item.cantidad, item.precio]
        );

        await connection.query(
          `UPDATE productos SET stock = stock - ? WHERE id = ?`,
          [item.cantidad, item.id]
        );

        await connection.query(
          `INSERT INTO productos_comprados (usuario_id, producto_id, pedido_id) 
           VALUES (?, ?, ?)`,
          [usuarioId, item.id, pedidoId]
        );
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({ 
        success: true, 
        message: 'Pedido realizado correctamente',
        pedidoId: pedidoId,
        esInvitado
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Error al procesar pedido:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al procesar el pedido' 
    }, { status: 500 });
  }
}