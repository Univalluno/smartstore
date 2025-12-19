import { pool } from "../_lib/db.js";
import { TOTPUtils } from "../../utils/totp.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ error: "UserId y token requeridos" });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = userResult.rows[0];

    if (!user.mfa_enabled) {
      return res.status(400).json({ error: "MFA no está habilitado para este usuario" });
    }

    const isValid = TOTPUtils.verifyToken(user.mfa_secret, token);

    if (!isValid) {
      return res.status(401).json({ error: "Código MFA inválido" });
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mfaEnabled: user.mfa_enabled  // ✅ CRÍTICO: Incluir esto
      },
      token: jwtToken
    });

  } catch (error) {
    console.error("MFA LOGIN ERROR:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
}