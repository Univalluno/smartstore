import fetch from "node-fetch";

async function testMFA() {
  console.log(" Probando MFA Setup...");
  
  try {
    // 1. Obtener QR y secret
    const setupRes = await fetch("http://localhost:3000/api/auth/mfa-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" })
    });
    
    const setupData = await setupRes.json();
    console.log(" Setup respuesta:", setupData);
    
    if (!setupData.success) {
      console.log(" Error en setup:", setupData.error);
      return;
    }
    
    const secret = setupData.secret;
    console.log(" Secret para pruebas:", secret);
    
    // 2. Verificar con código falso
    console.log("\n Probando verificación (código incorrecto)...");
    const verifyRes = await fetch("http://localhost:3000/api/auth/mfa-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, token: "000000" })
    });
    
    const verifyData = await verifyRes.json();
    console.log(" Verificación respuesta:", verifyData);
    
    console.log("\n Para probar con código real:");
    console.log("1. Escanea el QR en Google Authenticator");
    console.log("2. Usa el código de 6 dígitos");
    console.log("3. Ejecuta: node test-mfa-verify.js TU_SECRET CODIGO");
    
  } catch (error) {
    console.log(" Error general:", error.message);
  }
}

testMFA();
