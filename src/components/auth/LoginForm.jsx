import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulación de login (FASE 1)
    setTimeout(() => {
      // En FASE 2, aquí harías fetch a tu API
      if (email && password.length >= 6) {
        // Guardar email temporal para el MFA
        localStorage.setItem('mfa_email', email);
        // Ir a configuración MFA
        navigate('/mfa-setup');
      } else {
        setError('Credenciales inválidas');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden w-full max-w-md border border-gray-700"
      >
        {/* Header con efecto neón */}
        <div className="relative p-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <h1 className="text-4xl font-bold text-white text-center relative z-10">
            SMARTSTORE
          </h1>
          <p className="text-blue-100 text-center mt-2 text-lg relative z-10">
            Acceso Seguro MFA
          </p>
          
          {/* Efecto de partículas */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Correo Electrónico
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            {/* Campo Contraseña */}
            <div className="mb-8">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Contraseña
                </div>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Botón de Login */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98]'} text-white shadow-lg`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Verificando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  INICIAR SESIÓN CON MFA
                </div>
              )}
            </button>

            {/* Info MFA */}
            <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="flex items-start">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white">Autenticación de Dos Factores</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Después del login, configurarás un código QR para Google Authenticator.
                    Nivel de seguridad: <span className="text-green-400 font-bold">ALTO</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Registro */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-blue-400 hover:text-blue-300 font-bold underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer seguridad */}
        <div className="px-8 py-4 bg-gray-900 border-t border-gray-800">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Protegido por encriptación SSL y MFA
          </div>
        </div>
      </motion.div>
    </div>
  );
}