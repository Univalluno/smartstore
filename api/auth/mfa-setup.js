import { TOTPUtils } from '../../utils/totp.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requerido' });
    
    const secretData = TOTPUtils.generateSecret(email);
    const qrCode = await TOTPUtils.generateQRCode(secretData.otpauth_url);
    
    res.status(200).json({
      success: true,
      secret: secretData.secret,
      qrCode: qrCode,
      otpauthUrl: secretData.otpauth_url,
      message: 'Escanea el QR con Google Authenticator'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}