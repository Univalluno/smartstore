// api/orders.js
import { pool } from './_lib/db.js';

export default async function handler(req, res) {
  console.log(`📞 ${req.method} ${req.url}`);

  // =========================
  // 🟢 GET: listar órdenes por usuario
  // =========================
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId requerido'
        });
      }

      const result = await pool.query(
        `
        SELECT *
        FROM orders
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
      );

      return res.status(200).json({
        success: true,
        orders: result.rows
      });

    } catch (error) {
      console.error('❌ Error obteniendo órdenes:', error);
      return res.status(500).json({
        success: false,
        error: 'Error obteniendo órdenes'
      });
    }
  }

  // =========================
  // 🟢 POST: crear orden
  // =========================
  if (req.method === 'POST') {
    try {
      const {
        userId,
        totalAmount,
        cartItems,
        customerEmail,
        customerName,
        customerPhone,
        shippingAddress,
        city,
        state,
        zipCode,
        paymentMethod
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId requerido'
        });
      }

      const orderNumber = `ORD-${Date.now()}`;

      const result = await pool.query(
        `
        INSERT INTO orders (
          user_id,
          total,
          status,
          order_number,
          customer_email,
          customer_name,
          customer_phone,
          shipping_address,
          city,
          state,
          zip_code,
          payment_method,
          items,
          created_at
        )
        VALUES (
          $1, $2, 'pending', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
        )
        RETURNING id, order_number, created_at
        `,
        [
          userId,
          totalAmount,
          orderNumber,
          customerEmail,
          customerName,
          customerPhone,
          shippingAddress,
          city,
          state,
          zipCode,
          paymentMethod,
          JSON.stringify(cartItems)
        ]
      );

      const order = result.rows[0];

      return res.status(201).json({
        success: true,
        orderId: order.id,
        orderNumber: order.order_number,
        createdAt: order.created_at
      });

    } catch (error) {
      console.error('❌ Error creando orden:', error);
      return res.status(500).json({
        success: false,
        error: 'Error creando la orden'
      });
    }
  }

  // =========================
  // 🟢 PUT: actualizar estado / pago
  // =========================
  if (req.method === 'PUT') {
    try {
      const { orderId, paymentStatus, paymentReference } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: 'orderId requerido'
        });
      }

      await pool.query(
        `
        UPDATE orders
        SET
          status = $1,
          payment_reference = $2,
          updated_at = NOW()
        WHERE id = $3
        `,
        [
          paymentStatus || 'paid',
          paymentReference || null,
          orderId
        ]
      );

      return res.status(200).json({
        success: true,
        message: 'Orden actualizada'
      });

    } catch (error) {
      console.error('❌ Error actualizando orden:', error);
      return res.status(500).json({
        success: false,
        error: 'Error actualizando la orden'
      });
    }
  }

  // =========================
  // ❌ Método no permitido
  // =========================
  return res.status(405).json({
    success: false,
    error: 'Método no permitido'
  });
}
