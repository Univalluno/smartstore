// src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('request'); // 'request', 'validate', 'reset'
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  
  const navigate = useNavigate();
  const { token: urlToken } = useParams();

  // Si hay token en la URL, validarlo
  useEffect(() => {
    if (urlToken) {
      setToken(urlToken);
      setStep('validate');
      validateToken(urlToken);
    }
  }, [urlToken]);

  const validateToken = async (tokenToValidate) => {
    try {
      const response = await fetch(`/api/password/validate/${tokenToValidate}`)

      const data = await response.json();
      
      if (data.valid) {
        setTokenValid(true);
        setStep('reset');
      } else {
        setTokenValid(false);
        toast.error('El enlace ha expirado o es inválido');
      }
    } catch (error) {
      setTokenValid(false);
      toast.error('Error validando el enlace');
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/password/forgot', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al solicitar');
      }

      toast.success(data.message, { duration: 5000 });
      
      if (data.resetLink) {
        console.log('🔗 Enlace de desarrollo:', data.resetLink);
        toast.info(`Enlace (solo desarrollo): ${data.resetLink}`, { duration: 10000 });
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('Mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/password/reset/${token}`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar contraseña');
      }

      toast.success('✅ Contraseña actualizada. Redirigiendo...', { duration: 3000 });
      
      setTimeout(() => {
        navigate('/auth');
      }, 2000);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md"
      >
        <div className="bg-gradient-to-r from-orange-600 to-pink-600 p-8 relative">
          <button
            onClick={() => navigate('/auth')}
            className="absolute top-4 right-4 text-white text-2xl font-bold"
          >
            ×
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-black text-white">
              {step === 'request' ? 'Recuperar Contraseña' : 
               step === 'validate' ? 'Validando...' : 
               'Nueva Contraseña'}
            </h1>
          </div>
        </div>

        <div className="p-8">
          {/* Paso 1: Solicitar */}
          {step === 'request' && (
            <form onSubmit={handleRequest}>
              <p className="text-gray-600 mb-6">
                Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.
              </p>
              
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                required
              />
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold ${
                  loading ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {loading ? 'Enviando...' : 'Enviar Instrucciones'}
              </button>
            </form>
          )}

          {/* Paso 2: Validando token */}
          {step === 'validate' && tokenValid === null && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Validando enlace...</p>
            </div>
          )}

          {step === 'validate' && tokenValid === false && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">El enlace ha expirado o es inválido</p>
              <button
                onClick={() => navigate('/auth')}
                className="text-orange-600 hover:text-orange-800"
              >
                Volver al login
              </button>
            </div>
          )}

          {/* Paso 3: Nueva contraseña */}
          {step === 'reset' && (
            <form onSubmit={handleReset}>
              <p className="text-gray-600 mb-6">
                Ingresa tu nueva contraseña
              </p>
              
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                required
                minLength="6"
              />
              
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
                required
              />
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold ${
                  loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;