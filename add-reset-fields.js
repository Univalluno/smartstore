// add-reset-fields.js
import pool from './config/db.js';

async function addResetFields() {
  try {
    const connection = await pool.getConnection();
    
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP NULL
    `);
    
    console.log('✅ Columnas agregadas');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addResetFields();