// src/pages/AuthPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [mfaSecret, setMfaSecret] = useState("");
  const [mfaUserId, setMfaUserId] = useState(null);
  const [mfaSetupData, setMfaSetupData] = useState(null);
  const [showMFACode, setShowMFACode] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [qrImage, setQrImage] = useState("");

  // Estados para recuperar contraseña
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const navigate = useNavigate();
  const { login, completeMFALogin, pendingUser } = useAuth();

  // Manejar usuario pendiente de MFA al cargar
  useEffect(() => {
    if (pendingUser) {
      setMfaUserId(pendingUser.id);
      setShowMFACode(true);
      toast("Sesión requiere verificación MFA", { icon: "🔐" });
    }
  }, [pendingUser]);

  // ===== LOGIN / REGISTER =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setShowQR(false);
    setShowMFACode(false);

    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email, password }
        : {
            email,
            password,
            name: `${firstName} ${lastName}`,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Algo salió mal");

      // MFA - Casos antiguos (para compatibilidad)
      if (isLogin && data.setup && data.qr) {
        setTempToken(data.tempToken);
        setQrImage(data.qr);
        setShowQR(true);
      } else if (isLogin && data.mfaRequired) {
        setTempToken(data.tempToken);
        setShowMFACode(true);
      } else if (!isLogin) {
        // ✅ REGISTRO: Si incluye QR MFA
        if (data.mfaSetup) {
          setMfaSetupData(data.mfaSetup);
          setMfaUserId(data.user.id);
          setShowQR(true);
          setQrImage(data.mfaSetup.qrCode);
          setMfaSecret(data.mfaSetup.secret);
          toast.success("¡Registro exitoso! Configura MFA escaneando el QR");
        } else {
          toast.success("Cuenta creada correctamente, ahora inicia sesión");
          setIsLogin(true);
          setPassword("");
        }
      } else {
        // ✅ LOGIN: Verificar si requiere MFA
        if (data.requiresMFA) {
          setMfaUserId(data.userId);
          setShowMFACode(true);
          toast("Ingresa código MFA", { icon: "🔐" });
        if (data.requiresMFA) {
  setMfaUserId(data.userId);
  setShowMFACode(true);
  toast("Ingresa código MFA", { icon: "🔐" });
  return;
}

// ✅ SOLO SI NO HAY MFA
login(data.user, data.token);
navigate("/");
        }
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== VERIFICAR MFA (2 CASOS: ACTIVACIÓN Y LOGIN) =====
  const handleVerifyMFA = async () => {
    try {
      let response;
      let endpoint;

      if (showQR) {
        // CASO 1: Verificar código para ACTIVAR MFA (después de registro)
        endpoint = "/api/auth/enable-mfa";
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: mfaUserId,
            token: mfaCode,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Código inválido");

        toast.success("✅ MFA activado correctamente");
        setShowQR(false);
        setMfaCode("");
        
        // ✅ MEJORADO: Redirigir automáticamente al login
        toast.success("✅ Ahora inicia sesión con tu nueva cuenta");
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");

      } else if (showMFACode) {
        // CASO 2: Verificar código para LOGIN MFA
        endpoint = "/api/auth/mfa-login";
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: mfaUserId,
            token: mfaCode,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Código inválido");

        // ✅ USAR completeMFALogin EN LUGAR DE login
        completeMFALogin(data.user, data.token);
        toast.success("¡Autenticación exitosa! Redirigiendo...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  // ===== RECUPERAR CONTRASEÑA =====
  const handleForgotPassword = async () => {
    if (!recoveryEmail) {
      toast.error("Ingresa tu email");
      return;
    }
    setRecoveryLoading(true);
    try {
      const response = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al solicitar");

      toast.success(data.message, { duration: 5000 });
      setShowForgotModal(false);
      setRecoveryEmail("");
    } catch (error) {
      toast.error(error.message || "Error de conexión");
    } finally {
      setRecoveryLoading(false);
    }
  };

  // ===== FUNCIONES OAUTH =====
  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-600 to-pink-600 p-8 relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-white text-2xl font-bold"
          >
            ×
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-black text-white">
              {isLogin ? "Inicia Sesión" : "Crea tu Cuenta"}
            </h1>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full mb-3 p-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Apellidos"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full mb-3 p-3 border rounded"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-3 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 border rounded"
            required
          />

          {isLogin && (
            <div className="mb-6 text-right">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-orange-600 hover:text-orange-800 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-bold py-3 rounded"
          >
            {loading
              ? "Procesando..."
              : isLogin
              ? "Iniciar Sesión"
              : "Registrarse"}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600"
            >
              {isLogin ? "Crear cuenta" : "Ya tengo cuenta"}
            </button>
          </div>

          {/* OAUTH */}
          <div className="mt-8">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">
                O inicia con
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
            </div>
          </div>
        </form>

        {/* QR MFA PARA REGISTRO */}
        {showQR && mfaSetupData && (
          <div className="p-6 text-center border-t">
            <h3 className="text-lg font-bold mb-4">🔒 Configurar Autenticación en Dos Pasos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Escanea este QR con Google Authenticator
            </p>
            <img
              src={mfaSetupData.qrCode}
              alt="QR MFA"
              className="mx-auto w-48 h-48 border-2 border-gray-300 rounded-lg"
            />

            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
              className="mt-4 p-3 border rounded w-full text-center text-lg"
              maxLength={6}
            />

            <button
              onClick={handleVerifyMFA}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded font-medium"
            >
              Activar Autenticación en Dos Pasos
            </button>
          </div>
        )}

        {/* MFA LOGIN (cuando ya está activado) - DISEÑO MEJORADO */}
        {showMFACode && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-bold mb-4">🔐 Verificación en Dos Pasos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ingresa el código de 6 dígitos de Google Authenticator
            </p>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="000000"
              className="p-3 border rounded w-full text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoFocus
            />

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowMFACode(false);
                  setMfaCode("");
                  setError("");
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded font-medium"
              >
                Volver
              </button>
              <button
                onClick={handleVerifyMFA}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium"
              >
                Verificar y entrar
              </button>
            </div>
          </div>
        )}

        {/* MODAL RECUPERAR CONTRASEÑA */}
        {showForgotModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowForgotModal(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Recuperar Contraseña
                    </h3>
                    <button
                      onClick={() => setShowForgotModal(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Ingresa tu email y te enviaremos un enlace para restablecer
                    tu contraseña.
                  </p>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full mb-6 p-4 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleForgotPassword}
                      disabled={recoveryLoading}
                      className={`flex-1 py-3 rounded-xl font-medium ${
                        recoveryLoading
                          ? "bg-gray-400"
                          : "bg-orange-600 hover:bg-orange-700 text-white"
                      }`}
                    >
                      {recoveryLoading ? "Enviando..." : "Enviar Instrucciones"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;