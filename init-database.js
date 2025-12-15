// init-database.js
import pool from './config/db.js';

async function init() {
  try {
    const connection = await pool.getConnection();
    
    // Crear tabla de usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        mfaSecret VARCHAR(255),
        mfaEnabled BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabla "users" creada/verificada');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.log('❌ Error creando tabla:', error.message);
    process.exit(1);
  }
}

init();