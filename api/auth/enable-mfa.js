import { pool } from "../_lib/db.js";
import { TOTPUtils } from "../../utils/totp.js";

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
      "SELECT mfa_secret FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const mfaSecret = userResult.rows[0].mfa_secret;
    const isValid = TOTPUtils.verifyToken(mfaSecret, token);

    if (!isValid) {
      return res.status(400).json({ error: "Código inválido" });
    }

    await pool.query(
      "UPDATE users SET mfa_enabled = true WHERE id = $1",
      [userId]
    );

    res.status(200).json({
      ok: true,
      message: "MFA activado correctamente"
    });

  } catch (error) {
    console.error("ENABLE MFA ERROR:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
}