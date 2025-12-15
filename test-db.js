// test-db.js
import pool from './config/db.js';

async function test() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL funcionando desde config/db.js');
    connection.release();
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

test();