// config/db.js - CONEXIÓN A POSTGRESQL (PG)
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Nota: PostgreSQL prefiere usar la URL de conexión completa.
// Asumo que tu archivo .env tiene una variable como DATABASE_URL 
// que contiene la URL completa de Neon.

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    // Si usas las variables separadas (DB_HOST, DB_USER, etc.):
    /*
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    */
    ssl: {
        rejectUnauthorized: false // Recomendado para Vercel/Neon si hay problemas de SSL
    },
    max: 10, // Máximo de 10 conexiones simultáneas
    idleTimeoutMillis: 30000, // Desconectar clientes inactivos después de 30 segundos
});

// Prueba de conexión
pool.connect()
    .then(client => {
        console.log("PostgreSQL Pool Conectado Exitosamente!");
        client.release();
    })
    .catch(err => {
        console.error("Error al conectar PostgreSQL Pool:", err.stack);
    });


export default pool;