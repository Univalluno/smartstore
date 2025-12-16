import 'dotenv/config';
import { sendWelcomeEmail } from './utils/mailer.js';

(async () => {
  try {
    await sendWelcomeEmail(
      'jersondavidoterocruz@gmail.com',
      'Usuario de Prueba'
    );
    console.log('✅ Email enviado correctamente');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error enviando email:', err);
    process.exit(1);
  }
})();
