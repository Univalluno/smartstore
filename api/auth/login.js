import { pool } from "../_lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos" });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // ✅ NUEVO: Si tiene MFA habilitado, pedir código
    if (user.mfa_enabled) {
      return res.status(200).json({
        requiresMFA: true,
        userId: user.id,
        message: "Ingresa código MFA"
      });
    }

    // Si NO tiene MFA, generar JWT normal
    // 🔐 SI TIENE MFA → NO TOKEN
if (user.mfa_enabled) {
  return res.status(200).json({
    requiresMFA: true,
    userId: user.id
  });
}

// ✅ SOLO SIN MFA SE GENERA TOKEN
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
    mfaVerified: false
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mfaEnabled: user.mfa_enabled
      },
      token: token
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
}