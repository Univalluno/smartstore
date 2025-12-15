// routes/auth.js
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
// Importamos la función de envío de email
import { sendWelcomeEmail } from '../utils/mailer.js'; // Importación necesaria

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smartstore2025';

// Registro
router.post('/register', async (req, res) => {
  try {
    // Asegúrate de que los campos necesarios (email, password, y firstName para el email)
    // están siendo recibidos en el cuerpo de la solicitud (req.body)
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }



    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // 2. Crear nuevo usuario (asumiendo que User.create maneja firstName/userName)
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
    });


    // ----------------------------------------------------
    // Lógica agregada: Envío de Email de Bienvenida
    // ----------------------------------------------------
    await sendWelcomeEmail(newUser.email, newUser.firstName || 'Usuario');
    // Usamos newUser.firstName (si está disponible) o 'Usuario' por defecto.

    // 3. Responder con éxito
    res.json({
      message: 'Usuario creado exitosamente',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login + MFA
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario por email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2. Verificar contraseña
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Verificar MFA
    if (!user.mfaEnabled) {
      // Primera vez - generar secreto MFA
      const secret = speakeasy.generateSecret({
        name: `SmartStore (${email})`,
        issuer: "SmartStore"
      });

      // Guardar secreto en la base de datos
      await User.updateMFA(user.id, secret.base32, false);

      // Generar QR
      qrcode.toDataURL(secret.otpauth_url, (err, dataURL) => {
        if (err) {
          return res.status(500).json({ error: 'Error generando QR' });
        }

        res.json({
          tempToken: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '5m' }),
          qr: dataURL,
          setup: true,
          message: 'Escanea el QR con Google Authenticator'
        });
      });
    } else {
      // MFA ya configurado
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

// Verificar TOTP
router.post('/verify', async (req, res) => {
  try {
    const { tempToken, code } = req.body;

    // 1. Verificar token temporal
    const { id } = jwt.verify(tempToken, JWT_SECRET);

    // 2. Buscar usuario
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // 3. Verificar código TOTP
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code
    });

    if (!verified) {
      return res.status(401).json({ error: 'Código inválido' });
    }

    // 4. Activar MFA (si es la primera vez)
    if (!user.mfaEnabled) {
      await User.updateMFA(user.id, user.mfaSecret, true);
    }

    // 5. Generar token JWT final
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

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

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    console.error('Error en verify:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;