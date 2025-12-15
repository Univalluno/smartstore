import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT, 
  secure: false, // Usar 'false' para el puerto 587 (TLS/STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email de confirmación de registro
export const sendWelcomeEmail = async (to, userName) => {
  try {
    await transporter.sendMail({
      from: `"SmartStore" <${process.env.EMAIL_FROM}>`,
      to,
      subject: '¡Bienvenido a SmartStore!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">¡Bienvenido a SmartStore, ${userName}! 🎉</h2>
          <p>Tu cuenta ha sido creada exitosamente.</p>
          <p>Ahora puedes disfrutar de todas nuestras ofertas y productos.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0;">📍 <strong>Accede a tu cuenta:</strong> <a href="http://localhost:5173/auth">Iniciar Sesión</a>

          </div>
          <p>Gracias por unirte a nuestra comunidad.</p>
          <p style="color: #6b7280; font-size: 14px;">El equipo de SmartStore</p>
        </div>
      `
    });
    console.log(`✅ Email de bienvenida enviado a: ${to}`);
  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error.message);
    throw error;
  }
};

export const sendResetPasswordEmail = async (to, resetToken) => {
  try {
    const resetUrl = `http://localhost:5173/auth/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: `"SmartStore" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Recuperación de Contraseña SmartStore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">¿Olvidaste tu contraseña? 🔒</h2>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Haz clic en el siguiente botón para establecer una nueva contraseña:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Restablecer Contraseña
            </a>
          </div>
          <p>Si no solicitaste este cambio, por favor ignora este correo. Tu contraseña no cambiará hasta que accedas al enlace y crees una nueva.</p>
          <p style="color: #6b7280; font-size: 14px;">El equipo de SmartStore</p>
        </div>
      `
    });
    console.log(`✅ Email de recuperación de contraseña enviado a: ${to}`);
  } catch (error) {
    console.error('❌ Error enviando email de recuperación de contraseña:', error.message);
    throw error;
  }
};