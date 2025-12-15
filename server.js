// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

import authRoutes from './routes/auth.js';
import passwordResetRoutes from './routes/passwordReset.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Conexión a la base de datos
const connection = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordResetRoutes);

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

    // VALIDACIONES DETALLADAS
    console.log('🔍 Validando datos...');

    if (!customerName) {
      console.log('❌ Falta customerName');
      return res.status(400).json({ success: false, error: 'Falta nombre del cliente' });
    }
    if (!customerEmail) {
      console.log('❌ Falta customerEmail');
      return res.status(400).json({ success: false, error: 'Falta email del cliente' });
    }
    if (!cartItems || cartItems.length === 0) {
      console.log('❌ Falta cartItems o está vacío');
      return res.status(400).json({ success: false, error: 'El carrito está vacío' });
    }
    if (!totalAmount) {
      console.log('❌ Falta totalAmount');
      return res.status(400).json({ success: false, error: 'Falta el total de la orden' });
    }

    console.log('✅ Datos válidos');

    const orderNumber = 'ORD-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    console.log('📝 Número de orden generado:', orderNumber);

    // Insertar orden (AGREGAR shipping_notes)
    const [orderResult] = await connection.execute(
      `INSERT INTO orders 
      (order_number, user_id, customer_name, customer_email, customer_phone, 
       shipping_address, city, state, zip_code, shipping_notes, total_amount, payment_method) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        userId || null,
        customerName,
        customerEmail,
        customerPhone || '',
        shippingAddress || '',
        city || '',
        state || '',
        zipCode || '',
        shippingNotes || '',
        totalAmount,
        paymentMethod || 'card'
      ]
    );

    const orderId = orderResult.insertId;
    console.log('✅ Orden insertada. ID:', orderId);

    // Insertar items del pedido
    console.log('📦 Insertando', cartItems.length, 'items...');
    for (const item of cartItems) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_name, product_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.name, item.price, item.qty, item.price * item.qty]
      );
    }

    const invoiceNumber = 'FAC-' + orderNumber.slice(4);
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);
    const taxAmount = totalAmount * 0.19;

    console.log('🧾 Creando factura:', invoiceNumber);
    await connection.execute(
      `INSERT INTO invoices (order_id, invoice_number, issue_date, due_date, tax_amount, total_amount)
       VALUES (?, ?, ?, ?, ?, ?)`,
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
    console.error('📌 Detalles:', error.message);
    console.error('📌 SQL State:', error.code);
    console.error('📌 Stack:', error.stack);

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
    const [orders] = await connection.execute(
      `SELECT o.*, i.invoice_number, i.issue_date, i.due_date, i.total_amount as invoice_total
       FROM orders o
       LEFT JOIN invoices i ON o.id = i.order_id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Orden no encontrada' });
    }

    const [items] = await connection.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [req.params.id]
    );

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
// Actualizar estado de pago
app.post('/api/orders/:id/payment-status', async (req, res) => {
  try {
    const { paymentStatus, paymentReference } = req.body;

    await connection.execute(
      `UPDATE orders SET payment_status = ?, payment_reference = ? WHERE id = ?`,
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

    const [result] = await connection.execute(
      `UPDATE orders SET 
        payment_status = ?, 
        payment_reference = ?,
        order_status = 'processing',
        updated_at = CURRENT_TIMESTAMP
       WHERE order_number = ?`,
      [paymentStatus, paymentReference, orderNumber]
    );

    if (result.affectedRows === 0) {
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
    const [orders] = await connection.execute(
      `SELECT o.*, i.invoice_number, i.issue_date, i.due_date, i.total_amount as invoice_total
       FROM orders o
       LEFT JOIN invoices i ON o.id = i.order_id
       WHERE o.order_number = ?`,
      [req.params.orderNumber]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }

    const [items] = await connection.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orders[0].id]
    );

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

// ============================
// Inicializar servidor
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});