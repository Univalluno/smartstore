// server.js
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
// ELIMINADO: import mysql from 'mysql2/promise';

// AÑADIDO: Importamos el Pool de PostgreSQL
import { Pool } from 'pg';

import authRoutes from './routes/auth.js';
import passwordResetRoutes from './routes/passwordReset.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ===============================================
// CONEXIÓN A LA BASE DE DATOS (PostgreSQL/Neon)
// ===============================================

const CONNECTION_STRING = process.env.DATABASE_URL;

if (!CONNECTION_STRING) {
  console.error("❌ ERROR CRÍTICO: La variable DATABASE_URL de Neon no está configurada.");
  throw new Error("DATABASE_URL no está definida. Necesita la cadena de conexión de Neon.");
}

const pool = new Pool({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false // Permite la conexión segura a Neon
  }
});

// Prueba de conexión y manejo de errores (CRÍTICO)
await pool.connect()
  .then(client => {
    client.release();
    console.log('✅ Conexión exitosa a PostgreSQL (Neon).');
  })
  .catch(err => {
    console.error('❌ ERROR: Fallo la conexión a PostgreSQL (Neon).', err.stack);
    process.exit(1);
  });

// Renombramos la variable para que el código existente no tenga que cambiar
const connection = pool;

// ===============================================
// FIN CONEXIÓN
// ===============================================


// Rutas existentes
app.use('/api/auth', authRoutes); // NOTA: Debes asegurarte que tus rutas de auth y password usen 'connection'
app.use('/api/password', passwordResetRoutes);  // Si requieren la conexión, pásala como argumento

// ============================
// Rutas para órdenes y facturas
// ============================

// Crear una nueva orden
app.post('/api/orders', async (req, res) => {
  console.log('🔵 POST /api/orders recibido');
  console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

  try {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      state,
      zipCode,
      shippingNotes,
      paymentMethod,
      cartItems,
      totalAmount
    } = req.body;

    // VALIDACIONES DETALLADAS (omito para brevedad)
    if (!customerName || !customerEmail || !cartItems || cartItems.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, error: 'Faltan datos requeridos para la orden.' });
    }
    console.log('✅ Datos válidos');

    const orderNumber = 'ORD-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    console.log('📝 Número de orden generado:', orderNumber);

    // 1. INSERTAR ORDEN (CAMBIO CRÍTICO: execute -> query, ? -> $n, insertId -> RETURNING id)
    const orderResult = await connection.query(
      `INSERT INTO orders 
      (order_number, user_id, customer_name, customer_email, customer_phone, 
       shipping_address, city, state, zip_code, shipping_notes, total_amount, payment_method) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING id`, // <<-- NECESARIO para obtener el ID en Postgres
      [
        orderNumber,
        userId, // userId || null NO es necesario en JS si la columna lo permite
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        state,
        zipCode,
        shippingNotes,
        totalAmount,
        paymentMethod || 'card'
      ]
    );

    // CAMBIO CRÍTICO: Obtener el ID de la primera fila devuelta
    const orderId = orderResult.rows[0].id;
    console.log('✅ Orden insertada. ID:', orderId);

    // 2. Insertar items del pedido
    console.log('📦 Insertando', cartItems.length, 'items...');
    for (const item of cartItems) {
      await connection.query( // execute -> query
        `INSERT INTO order_items (order_id, product_name, product_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5)`, // ? -> $n
        [orderId, item.name, item.price, item.qty, item.price * item.qty]
      );
    }

    const invoiceNumber = 'FAC-' + orderNumber.slice(4);
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);
    const taxAmount = totalAmount * 0.19;

    console.log('🧾 Creando factura:', invoiceNumber);
    // 3. Insertar factura
    await connection.query( // execute -> query
      `INSERT INTO invoices (order_id, invoice_number, issue_date, due_date, tax_amount, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6)`, // ? -> $n
      [
        orderId,
        invoiceNumber,
        issueDate.toISOString().split('T')[0],
        dueDate.toISOString().split('T')[0],
        taxAmount,
        totalAmount + taxAmount
      ]
    );

    console.log('🎉 Orden completada exitosamente');

    res.json({
      success: true,
      orderId,
      orderNumber,
      invoiceNumber,
      message: 'Orden creada exitosamente'
    });

  } catch (error) {
    console.error('❌ ERROR en /api/orders:', error);
    // Mantenemos el manejo de errores original
    res.status(500).json({
      success: false,
      error: 'Error creando orden: ' + error.message,
      details: error.code
    });
  }
});

// Obtener orden por ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    // execute -> query
    const ordersResult = await connection.query(
      `SELECT o.*, i.invoice_number, i.issue_date, i.due_date, i.total_amount as invoice_total
       FROM orders o
       LEFT JOIN invoices i ON o.id = i.order_id
       WHERE o.id = $1`, // ? -> $1
      [req.params.id]
    );

    const orders = ordersResult.rows; // Obtener filas en PostgreSQL

    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    // execute -> query
    const itemsResult = await connection.query(
      `SELECT * FROM order_items WHERE order_id = $1`, // ? -> $1
      [req.params.id]
    );

    const items = itemsResult.rows;

    res.json({
      success: true,
      order: orders[0],
      items
    });

  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({ success: false, error: 'Error obteniendo orden' });
  }
});

// Actualizar estado de pago
app.post('/api/orders/:id/payment-status', async (req, res) => {
  try {
    const { paymentStatus, paymentReference } = req.body;

    await connection.query( // execute -> query
      `UPDATE orders SET payment_status = $1, payment_reference = $2 WHERE id = $3`, // ? -> $n
      [paymentStatus, paymentReference, req.params.id]
    );

    res.json({ success: true, message: 'Estado de pago actualizado' });

  } catch (error) {
    console.error('Error actualizando estado de pago:', error);
    res.status(500).json({ success: false, error: 'Error actualizando pago' });
  }
});

// ===========================================
// NUEVO: Rutas para simulación de pago
// ===========================================

// Actualizar estado de pago por número de orden
app.post('/api/orders/:orderNumber/status', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { paymentStatus, paymentReference } = req.body;

    console.log(`🔄 Actualizando orden ${orderNumber} a estado: ${paymentStatus}`);

    const result = await connection.query( // execute -> query
      `UPDATE orders SET 
        payment_status = $1, 
        payment_reference = $2,
        order_status = 'processing',
        updated_at = CURRENT_TIMESTAMP
       WHERE order_number = $3`, // ? -> $3
      [paymentStatus, paymentReference, orderNumber]
    );

    // affectedRows en PostgreSQL está en result.rowCount
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }

    console.log(`✅ Orden ${orderNumber} actualizada a ${paymentStatus}`);

    res.json({
      success: true,
      message: 'Estado de pago actualizado',
      orderNumber,
      paymentStatus
    });

  } catch (error) {
    console.error('Error actualizando estado de pago:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando pago'
    });
  }
});

// Ruta para obtener orden por número de orden
app.get('/api/orders/number/:orderNumber', async (req, res) => {
  try {
    const ordersResult = await connection.query( // execute -> query
      `SELECT o.*, i.invoice_number, i.issue_date, i.due_date, i.total_amount as invoice_total
       FROM orders o
       LEFT JOIN invoices i ON o.id = i.order_id
       WHERE o.order_number = $1`, // ? -> $1
      [req.params.orderNumber]
    );

    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }

    const itemsResult = await connection.query( // execute -> query
      `SELECT * FROM order_items WHERE order_id = $1`, // ? -> $1
      [orders[0].id]
    );

    const items = itemsResult.rows;

    res.json({
      success: true,
      order: orders[0],
      items
    });

  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo orden'
    });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

// Cualquier ruta que no sea /api devuelve React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// ============================
// Inicializar servidor esto se quito jerso
// ============================
//const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => {
  //console.log(`Servidor corriendo en puerto ${PORT}`);
//});