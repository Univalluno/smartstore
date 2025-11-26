// routes/auth.js
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smartstore2025';

// Registro
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.json({ message: 'Usuario creado' });
});

// Login + MFA
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  if (!user.mfaEnabled) {
    const secret = speakeasy.generateSecret({ name: `SmartStore (${email})` });
    user.mfaSecret = secret.base32;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, dataURL) => {
      res.json({
        tempToken: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '5m' }),
        qr: dataURL,
        setup: true
      });
    });
  } else {
    res.json({
      tempToken: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '5m' }),
      mfaRequired: true
    });
  }
});

// Verificar TOTP
router.post('/verify', async (req, res) => {
  const { tempToken, code } = req.body;
  try {
    const { id } = jwt.verify(tempToken, JWT_SECRET);
    const user = await User.findById(id);

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code
    });

    if (!verified) return res.status(401).json({ error: 'Código inválido' });

    user.mfaEnabled = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: 'Token expirado' });
  }
});

export default router;
