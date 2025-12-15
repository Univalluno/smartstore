// check-table.js
import pool from './config/db.js';

async function check() {
  const connection = await pool.getConnection();
  
  // Verificar estructura de la tabla
  const [rows] = await connection.query('DESCRIBE users');
  console.log('📋 Estructura de la tabla "users":');
  console.table(rows);
  
  connection.release();
  process.exit(0);
}

check().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});