import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? {} : false,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

export { pool };














// Crear el pool de conexiones - usa el nombre exacto de la BD
/*export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // Vacío si es XAMPP por defecto
  database: 'misipuchiful',  // AHORA EN MINÚSCULAS
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}*/