import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    console.log('🔄 AuthContext: Verificando sesión guardada...');
    const savedUser = localStorage.getItem('smartstore_user');
    const savedToken = localStorage.getItem('smartstore_token');
    
    if (savedUser && savedToken) {
      const userData = JSON.parse(savedUser);
      console.log('📋 Usuario en localStorage:', userData);
      
      // ✅ SIEMPRE pedir MFA si el usuario lo tiene habilitado
      if (userData.mfaEnabled) {
        console.log('⚠️ Usuario con MFA encontrado, requiere verificación');
        setRequiresMFA(true);
        setPendingUser(userData); // Guardar como pendiente
        // NO establecer setUser() - forzar verificación MFA
      } else {
        console.log('✅ Usuario sin MFA, restaurando sesión');
        setUser(userData);
      }
    } else {
      console.log('📭 No hay sesión guardada');
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    console.log('🔐 Login ejecutado:', userData);
    
    // Verificar si el usuario tiene MFA habilitado
    if (userData.mfaEnabled) {
      console.log('⚠️ Usuario requiere verificación MFA');
      setRequiresMFA(true);
      setPendingUser(userData);
      return { requiresMFA: true, userId: userData.id };
    } else {
      console.log('✅ Usuario sin MFA, login directo');
      setUser(userData);
      localStorage.setItem('smartstore_user', JSON.stringify(userData));
      localStorage.setItem('smartstore_token', token);
      return { requiresMFA: false };
    }
  };

  const completeMFALogin = (userData, token) => {
    console.log('✅ Login MFA completado:', userData);
    
    // ✅ FORZAR mfaEnabled: true siempre
    const userWithMFA = {
      ...userData,
      mfaEnabled: true  // Esto asegura que al recargar pida MFA
    };
    
    setUser(userWithMFA);
    setRequiresMFA(false);
    setPendingUser(null);
    
    // ✅ Guardar CON mfaEnabled: true
    localStorage.setItem('smartstore_user', JSON.stringify(userWithMFA));
    localStorage.setItem('smartstore_token', token);
    
    console.log('💾 Sesión guardada con mfaEnabled:', userWithMFA.mfaEnabled);
  };

  const logout = () => {
    console.log('🚪 Logout ejecutado');
    setUser(null);
    setRequiresMFA(false);
    setPendingUser(null);
    localStorage.removeItem('smartstore_user');
    localStorage.removeItem('smartstore_token');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('smartstore_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateProfile, 
      loading,
      requiresMFA,
      pendingUser,
      completeMFALogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};