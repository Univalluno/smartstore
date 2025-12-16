// routes/auth.js
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { sendWelcomeEmail } from '../utils/mailer.js';

axios.post(`${import.meta.env.VITE_API_URL}/login`)


/**
 * ============================
 * REGISTRO
 * ============================
 */
console.log('BODY RECIBIDO:', req.body);

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }
const [firstName, ...lastParts] = name.split(' ');
    const lastName = lastParts.join(' ') || '';
    // Verificar si existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'El usuario ya existe'
      });
    }

    // Crear usuario
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    // Enviar email de bienvenida (no bloqueante)
    try {
      await sendWelcomeEmail(newUser.email, newUser.firstName);
    } catch (mailError) {
      console.warn('No se pudo enviar email de bienvenida:', mailError.message);
    }

    res.json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * ============================
 * LOGIN + MFA
 * ============================
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Validar contraseña
    const validPassword = await User.comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // MFA no configurado
    if (!user.mfaEnabled) {
      const secret = speakeasy.generateSecret({
        name: `SmartStore (${email})`,
        issuer: 'SmartStore'
      });

      await User.updateMFA(user.id, secret.base32, false);

      qrcode.toDataURL(secret.otpauth_url, (err, qr) => {
        if (err) {
          return res.status(500).json({ error: 'Error generando QR' });
        }

        res.json({
          tempToken: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '5m' }),
          qr,
          setup: true,
          message: 'Escanea el QR con Google Authenticator'
        });
      });

    } else {
      // MFA ya activo
      res.json({
        tempToken: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '5m' }),
        mfaRequired: true,
        message: 'Ingresa el código de tu autenticador'
      });
    }

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * ============================
 * VERIFICAR MFA (TOTP)
 * ============================
 */
router.post('/verify', async (req, res) => {
  try {
    const { tempToken, code } = req.body;

    // Verificar token temporal
    const { id } = jwt.verify(tempToken, JWT_SECRET);

    // Buscar usuario
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Verificar TOTP
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) {
      return res.status(401).json({ error: 'Código inválido' });
    }

    // Activar MFA si es primera vez
    if (!user.mfaEnabled) {
      await User.updateMFA(user.id, user.mfaSecret, true);
    }

    // Token final
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      message: 'Autenticación exitosa',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    console.error('Error en verify:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
