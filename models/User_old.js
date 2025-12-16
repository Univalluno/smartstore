// models/User.js - PostgreSQL/Neon
import { pool } from '../config/db.js'; // Importamos el pool de PostgreSQL
import bcrypt from 'bcryptjs';

class User {
  // Crear usuario
  static async create(userData) {
    const { email, password, firstName, lastName } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    // CORRECCIÓN: Incluir mfa_secret y mfa_enabled con valores por defecto
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, mfa_secret, mfa_enabled) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [email, hashedPassword, firstName, lastName, null, false] // Usamos NULL y FALSE (booleano)
    );

    // Obtener el ID de la fila devuelta (PostgreSQL)
    return {
      id: result.rows[0].id,
      email,
      firstName,
      lastName
    };
  }


  // Buscar por email
  static async findByEmail(email) {
    // CAMBIO: Usar $1 y obtener el resultado de 'rows'
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (user) {
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password_hash,
        mfaSecret: user.mfa_secret,
        // Usar booleano si la columna es BOOLEAN en Neon, si no, mantener 1/0
        mfaEnabled: user.mfa_enabled === true || user.mfa_enabled === 1
      };

    }
    return null;
  }


  // Buscar por ID
  static async findById(id) {
    // CAMBIO: Usar $1 y obtener el resultado de 'rows'
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    const user = result.rows[0];

    if (user) {
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password_hash,
        mfaSecret: user.mfa_secret,
        mfaEnabled: user.mfa_enabled === true || user.mfa_enabled === 1
      };

    }
    return null;
  }

  // Comparar contraseña (Sin cambios)
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Actualizar MFA
  static async updateMFA(id, mfaSecret, mfaEnabled) {
    // CAMBIO: Usar $n
    await pool.query(
      'UPDATE users SET mfa_secret = $1, mfa_enabled = $2 WHERE id = $3',
      [mfaSecret, mfaEnabled, id]
    );
  }

  // ===============================
  // Actualizar contraseña
  // ===============================
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // CAMBIO: Usar $n
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, id]
    );
  }
}

export default User;