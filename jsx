import { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qr, setQr] = useState('');
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [message, setMessage] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (res.data.setup) {
        setQr(res.data.qr);
        setTempToken(res.data.tempToken);
        setMessage('Escanea el QR y coloca el código');
      } else if (res.data.mfaRequired) {
        setTempToken(res.data.tempToken);
        setMessage('Ingresa tu código del autenticador');
      }
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || 'credenciales inválidas'));
    }
  };

  const verify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify', { tempToken, code });
      setMessage('¡LOGIN EXITOSO! Token recibido');
      console.log('Token:', res.data.token);
    } catch (err) {
      setMessage('Código incorrecto o expirado');
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
      <h1>SmartStore</h1>
      <h2>Login con MFA</h2>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} /><br/><br/>
      <input type="password" placeholder="contraseña" value={password} onChange={e => setPassword(e.target.value)} /><br/><br/>
      <button onClick={login}>Iniciar sesión</button>
      <p style={{color: 'red'}}>{message}</p>

      {qr && <div><img src={qr} alt="QR MFA" /><br/></div>}

      {tempToken && (
        <>
          <input placeholder="código 6 dígitos" value={code} onChange={e => setCode(e.target.value)} maxLength="6" />
          <button onClick={verify}>Verificar</button>
        </>
      )}
    </div>
  );
}

export default App;
