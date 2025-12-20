import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { pool } from "../../_lib/db.js";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.redirect("/auth?error=google");
  }

  try {
    // 1️⃣ Obtener token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    // 2️⃣ Perfil Google
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const googleUser = await profileRes.json();

    // 3️⃣ Buscar usuario
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [googleUser.email]
    );

    let user;

    if (result.rows.length === 0) {
      const insert = await pool.query(
        `INSERT INTO users (name, email, password, role, mfa_enabled)
         VALUES ($1, $2, 'oauth', 'user', false)
         RETURNING id, name, email, role, mfa_enabled`,
        [googleUser.name, googleUser.email]
      );
      user = insert.rows[0];
    } else {
      user = result.rows[0];
    }

    // 4️⃣ JWT igual a login normal
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Redirigir al frontend
    res.redirect(
      `/oauth-success?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (err) {
    console.error("GOOGLE OAUTH ERROR:", err);
    res.redirect("/auth?error=google");
  }
}
