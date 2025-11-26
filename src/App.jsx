import { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qr, setQr] = useState('');
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [token, setToken] = useState('');

  const login = async () => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    if (res.data.setup) {
      setQr(res.data.qr);
      setTempToken(res.data.tempToken);
    } else if (res.data.mfaRequired) {
      setTempToken(res.data.tempToken);
    }
  };

  const verify = async () => {
    const res = await axios.post('http://localhost:5000/api/auth/verify', { tempToken, code });
    setToken(res.data.token);
    alert('¡Login exitoso con MFA!');
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1>SmartStore – Login con MFA</h1>
      {!token ? (
        <>
          <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} /><br/><br/>
          <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} /><br/><br/>
          <button onClick={login}>Login</button>

          {qr && <div><img src={qr} /><br/>
            <input placeholder="código 6 dígitos" value={code} onChange={e => setCode(e.target.value)} />
            <button onClick={verify}>Verificar</button>
          </div>}

          {tempToken && !qr && <div>
            <input placeholder="código autenticador" value={code} onChange={e => setCode(e.target.value)} />
            <button onClick={verify}>Verificar MFA</button>
          </div>}
        </>
      ) : (
        <h2>¡Bienvenido! Token: {token.slice(0, 20)}...</h2>
      )}
    </div>
  );
}

export default App;
