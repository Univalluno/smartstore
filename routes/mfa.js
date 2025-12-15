// routes/mfa.js - Rutas para MFA
import express from 'express';
import { TOTPUtils } from '../utils/totp.js';

const router = express.Router();

// Ruta para generar nuevo secreto y QR
router.post('/setup', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username es requerido' });
    }
    
    // 1. Generar secreto
    const secretData = TOTPUtils.generateSecret(username);
    
    // 2. Generar QR
    const qrCode = await TOTPUtils.generateQRCode(secretData.otpauth_url);
    
    // 3. Responder
    res.json({
      success: true,
      secret: secretData.secret,
      qrCode: qrCode,
      message: 'Escanea el QR con Google Authenticator'
    });
    
  } catch (error) {
    console.error('Error en /setup:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para verificar código
router.post('/verify', (req, res) => {
  try {
    const { secret, token } = req.body;
    
    if (!secret || !token) {
      return res.status(400).json({ error: 'Secret y token son requeridos' });
    }
    
    // Verificar código
    const isValid = TOTPUtils.verifyToken(secret, token);
    
    if (isValid) {
      res.json({
        success: true,
        message: 'Código verificado correctamente'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Código inválido'
      });
    }
    
  } catch (error) {
    console.error('Error en /verify:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;