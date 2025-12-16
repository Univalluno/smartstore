// ===================================
// config/db.js (SOLUCIÓN DEFINITIVA)
// ===================================
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env para entornos locales/Node
dotenv.config({ path: path.resolve(process.cwd(), '.env') }); 

const CONNECTION_STRING = process.env.DATABASE_URL;

if (!CONNECTION_STRING) {
    console.error("❌ ERROR CRÍTICO: La variable DATABASE_URL de Neon no está configurada.");
    throw new Error("DATABASE_URL no está definida.");
}

// 1. DEFINICIÓN Y EXPORTACIÓN DEL POOL
export const pool = new Pool({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

// 2. EXPORTACIÓN DEL ALIAS (para compatibilidad si se usa 'connection')
export const connection = pool; 


// 3. PRUEBA DE CONEXIÓN
pool.connect()
    .then(client => {
        client.release();
        console.log('PostgreSQL Pool Conectado Exitosamente! ✅');
    })
    .catch(err => {
        console.error('❌ ERROR: Falló la conexión al Pool de PostgreSQL.', err.stack);
        process.exit(1); 
    });