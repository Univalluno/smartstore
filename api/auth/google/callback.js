import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // 1️⃣ Intercambiar code por access_token
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
        code
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const { access_token } = tokenRes.data;

    // 2️⃣ Obtener info del usuario
    const userRes = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const user = userRes.data;

    /**
     * user = {
     *  id,
     *  email,
     *  name,
     *  picture
     * }
     */

    // 3️⃣ Redirigir al frontend
    res.redirect(
      `${process.env.FRONTEND_URL}/login/success?email=${user.email}`
    );
  } catch (err) {
    console.error(err.response?.
