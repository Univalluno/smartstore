// server.js - Servidor principal
import express from 'express';
import cors from 'cors';
import mfaRoutes from './routes/mfa.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/mfa', mfaRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API en http://localhost:${PORT}`);
  console.log(`📌 Ruta MFA: http://localhost:${PORT}/api/mfa/setup`);
  console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
});