import { pool } from '../_lib/db.js';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '../../utils/mailer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    // verificar si existe
    const exists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, name, email, role`,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // enviar email (no rompe si falla)
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (e) {
      console.warn('⚠️ No se pudo enviar email:', e.message);
    }

    return res.status(201).json({
      ok: true,
      user
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
