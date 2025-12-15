import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1️⃣ Login inicial
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      /**
       * 🔐 OPCIÓN A:
       * Si tu backend YA valida MFA y devuelve usuario + token
       */
      if (data.user && data.token) {
        login(data.user, data.token);
        navigate('/dashboard');
        return;
      }

      /**
       * 🔐 OPCIÓN B:
       * Login correcto pero requiere MFA
       */
      if (data.tempToken) {
        localStorage.setItem('mfa_temp_token', data.tempToken);
        navigate('/mfa-setup');
        return;
      }

      throw new Error('Respuesta inesperada del servidor');

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden w-full max-w-md border border-gray-700"
      >
        {/* Header */}
        <div className="relative p-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <h1 className="text-4xl font-bold text-white text-center relative z-10">
            SMARTSTORE
          </h1>
          <p className="text-blue-100 text-center mt-2 text-lg relative z-10">
            Acceso Seguro MFA
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                required
                minLength="6"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg ${
                loading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105'
              } text-white`}
            >
              {loading ? 'Verificando...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-900 border-t border-gray-800 text-center text-xs text-gray-500">
          Protegido por SSL y MFA
        </div>
      </motion.div>
    </div>
  );
}
