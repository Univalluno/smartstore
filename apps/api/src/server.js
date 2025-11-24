import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js'; // Importar como named import

// Configurar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '✅ SmartStore API funcionando!', 
    timestamp: new Date(),
    database: 'MongoDB Local'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});