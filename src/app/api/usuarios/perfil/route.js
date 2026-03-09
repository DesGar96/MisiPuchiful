import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;

    const [usuarios] = await pool.query(
      `SELECT id, nombre, email, telefono, direccion, 
              tipo_via, nombre_via, numero_via, piso, codigo_postal, ciudad, rol 
       FROM usuarios WHERE id = ?`,
      [usuarioId]
    );

    if (usuarios.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usuario no encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: usuarios[0] 
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener los datos del perfil' 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        success: false, 
        error: 'No autorizado' 
      }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const usuarioId = sessionData.id;
    const { 
      nombre, 
      telefono, 
      direccion,
      tipo_via,
      nombre_via,
      numero_via,
      piso,
      codigo_postal,
      ciudad,
      passwordActual,
      nuevaPassword 
    } = await request.json();

    // Construir dirección completa 
    const direccionCompleta = direccion || (
      tipo_via && nombre_via && numero_via 
        ? `${tipo_via} ${nombre_via}, nº ${numero_via}${piso ? ', ' + piso : ''}, ${codigo_postal ? 'CP: ' + codigo_postal : ''} ${ciudad || ''}`.trim()
        : null
    );

    // Si se quiere cambiar la contraseña
    if (passwordActual && nuevaPassword) {
      // Verificar contraseña actual
      const [usuarios] = await pool.query(
        'SELECT password FROM usuarios WHERE id = ?',
        [usuarioId]
      );

      const passwordMatch = await bcrypt.compare(passwordActual, usuarios[0].password);
      
      if (!passwordMatch) {
        return NextResponse.json({ 
          success: false, 
          error: 'La contraseña actual no es correcta' 
        }, { status: 400 });
      }

      // Hashear nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

      // Actualizar con nueva contraseña
      await pool.query(
        `UPDATE usuarios SET 
         nombre = ?, telefono = ?, direccion = ?,
         tipo_via = ?, nombre_via = ?, numero_via = ?, 
         piso = ?, codigo_postal = ?, ciudad = ?,
         password = ?
         WHERE id = ?`,
        [nombre, telefono, direccionCompleta, tipo_via, nombre_via, numero_via, 
         piso, codigo_postal, ciudad, hashedPassword, usuarioId]
      );
    } else {
      // Actualizar sin cambiar contraseña
      await pool.query(
        `UPDATE usuarios SET 
         nombre = ?, telefono = ?, direccion = ?,
         tipo_via = ?, nombre_via = ?, numero_via = ?, 
         piso = ?, codigo_postal = ?, ciudad = ?
         WHERE id = ?`,
        [nombre, telefono, direccionCompleta, tipo_via, nombre_via, numero_via, 
         piso, codigo_postal, ciudad, usuarioId]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Perfil actualizado correctamente' 
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al actualizar el perfil' 
    }, { status: 500 });
  }
}