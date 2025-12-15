User.js - MySQL
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

class User {
  // Crear usuario
  static async create(userData) {
    const { email, password, firstName, lastName } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName]
    );

    return {
      id: result.insertId,
      email,
      firstName,
      lastName
    };
  }


  // Buscar por email
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows[0]) {
      const user = rows[0];
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password_hash,
        mfaSecret: user.mfa_secret,
        mfaEnabled: user.mfa_enabled === 1
      };

    }
    return null;
  }


  // Buscar por ID
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (rows[0]) {
      const user = rows[0];
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password_hash,
        mfaSecret: user.mfa_secret,
        mfaEnabled: user.mfa_enabled === 1
      };

    }
    return null;
  }

  // Comparar contraseña
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Actualizar MFA
  static async updateMFA(id, mfaSecret, mfaEnabled) {
    await pool.query(
      'UPDATE users SET mfa_secret = ?, mfa_enabled = ? WHERE id = ?',
      [mfaSecret, mfaEnabled ? 1 : 0, id]
    );
  }

  // ===============================
  // Actualizar contraseña
  // ===============================
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }
}

export default User;

