import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartstore')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

app.listen(5000, () => console.log('Server corriendo en puerto 5000'));
