// routes/passwordReset.js
import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import pool from '../config/db.js';
// ----------------------------------------------------------------
// CORRECCIÓN 1: Usar el nombre correcto de la función exportada:
import { sendResetPasswordEmail } from '../utils/mailer.js'; 
// ----------------------------------------------------------------

const router = express.Router();

/* ======================================================
    1. SOLICITAR RECUPERACIÓN DE CONTRASEÑA
    POST /api/password/forgot
====================================================== */
router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email es requerido' });
        }

        const user = await User.findByEmail(email);

        // No revelar si existe o no
        if (!user) {
            return res.json({
                message: 'Si el email existe, recibirás instrucciones'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetToken, resetTokenExpiry, user.id]
        );

        // ⚠️ PUERTO DEL FRONT (VITE)
        // La URL se construye aquí y se usa solo para el console.log, pero
        // la función de mailer solo necesita el token.
        const resetLink = `http://localhost:5173/auth/reset-password/${resetToken}`;


        console.log('📧 Reset link:', resetLink);
        
        // ----------------------------------------------------------------
        // CORRECCIÓN 2: Llamar a la función con el nombre correcto y el TOKEN
        await sendResetPasswordEmail(user.email, resetToken);
        // ----------------------------------------------------------------

        res.json({
            message: 'Instrucciones enviadas al email',
            resetLink // solo desarrollo
        });

    } catch (error) {
        console.error('Error en forgot:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

/* ======================================================
    2. RESTABLECER CONTRASEÑA
    POST /api/password/reset/:token
====================================================== */
router.post('/reset/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                error: 'Token y contraseña requeridos'
            });
        }

        const [rows] = await pool.query(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [token]
        );

        if (rows.length === 0) {
            return res.status(400).json({
                error: 'Token inválido o expirado'
            });
        }

        const user = rows[0];

        await User.updatePassword(user.id, password);

        await pool.query(
            'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [user.id]
        );

        res.json({
            message: 'Contraseña actualizada correctamente'
        });

    } catch (error) {
        console.error('Error en reset:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;