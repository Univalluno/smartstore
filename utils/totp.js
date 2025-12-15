// totp.js - Utilidades para TOTP y QR
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export class TOTPUtils {
  /**
   * Genera un secreto nuevo para un usuario
   */
  static generateSecret(username) {
    const secret = speakeasy.generateSecret({
      name: `SmartStore:${username}`,
      issuer: "SmartStore Inc"
    });
    
    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url
    };
  }

  /**
   * Genera un código QR en base64 a partir de una URL
   */
  static async generateQRCode(otpauthUrl) {
    try {
      // Generar QR como Data URL (base64)
      const qrCode = await QRCode.toDataURL(otpauthUrl);
      return qrCode;
    } catch (error) {
      console.error('Error generando QR:', error);
      throw new Error('No se pudo generar el QR');
    }
  }

  /**
   * Verifica si un código TOTP es válido
   */
  static verifyToken(secret, token) {
    try {
      return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1
      });
    } catch (error) {
      console.error('Error verificando token:', error);
      return false;
    }
  }
}

// Para probar
if (process.argv[2] === '--test') {
  console.log('=== PROBANDO TOTP CON QR ===');
  
  // 1. Generar secreto
  const resultado = TOTPUtils.generateSecret('test');
  console.log('1. Secreto:', resultado.secret);
  console.log('2. URL QR:', resultado.otpauth_url);
  
  // 2. Generar QR
  TOTPUtils.generateQRCode(resultado.otpauth_url)
    .then(qrCode => {
      console.log('3. QR generado (primeros 100 chars):');
      console.log(qrCode.substring(0, 100) + '...');
      console.log('\n✅ Todo funciona!');
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
    });
}