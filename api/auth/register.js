import { pool } from "../_lib/db.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../../utils/mailer.js";
import { TOTPUtils } from "../../utils/totp.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password, firstName, lastName } = req.body;
  const finalName = name || [firstName, lastName].filter(Boolean).join(" ");

  if (!finalName || !email || !password) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const mfaSecretData = TOTPUtils.generateSecret(email);
    const qrCode = await TOTPUtils.generateQRCode(mfaSecretData.otpauth_url);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, mfa_secret, mfa_enabled)
       VALUES ($1, $2, $3, 'user', $4, false)
       RETURNING id, name, email, role, mfa_enabled`,
      [finalName, email, hashedPassword, mfaSecretData.secret]
    );

    const user = result.rows[0];

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (e) {
      console.warn("No se pudo enviar email:", e.message);
    }

    return res.status(201).json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mfaEnabled: user.mfa_enabled
      },
      mfaSetup: {
        qrCode: qrCode,
        secret: mfaSecretData.secret,
        otpauthUrl: mfaSecretData.otpauth_url,
        message: "Escanea este QR con Google Authenticator"
      }
    });
    
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}