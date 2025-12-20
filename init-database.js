// D:\smartstore\init-database.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function init() {
  try {
    // 1. Crear tabla users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        mfa_secret VARCHAR(255),
        mfa_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "users" creada/verificada');

    // 2. Crear tabla products (si no existe)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "products" creada/verificada');
    // 3. Crear tabla orders
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        invoice_number VARCHAR(50),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        shipping_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        shipping_notes TEXT,
        payment_method VARCHAR(50) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        user_id INT REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "orders" creada/verificada');

    // 4. Crear tabla order_items
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "order_items" creada/verificada');

    pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    pool.end();
    process.exit(1);
  }
}

init();