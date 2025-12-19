import { TOTPUtils } from '../../utils/totp.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const { secret, token } = req.body;
    if (!secret || !token) return res.status(400).json({ error: 'Secret y token requeridos' });
    const isValid = TOTPUtils.verifyToken(secret, token);
    res.status(200).json({
      valid: isValid,
      message: isValid ? ' Código válido' : ' Código inválido'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
