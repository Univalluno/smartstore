import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env.local") });

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL no definida");
  process.exit(1);
}

console.log("URL:", process.env.DATABASE_URL.substring(0, 60) + "...");

const connectionString = process.env.DATABASE_URL.includes(":6543") 
  ? process.env.DATABASE_URL.replace(":6543", ":5432")
  : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  let client;
  try {
    client = await pool.connect();
    console.log("CONEXION EXITOSA");
    
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);
    
    console.log(`Tabla users existe? ${tableCheck.rows[0].exists}`);
    
    if (!tableCheck.rows[0].exists) {
      console.log("Creando tabla users...");
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Tabla creada");
    }
    
    console.log("Agregando MFA...");
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS mfa_secret TEXT,
      ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false
    `);
    
    console.log("MFA AGREGADO");
    client.release();
    
  } catch (error) {
    console.error("ERROR:", error.message);
    console.error("Codigo:", error.code);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

main();
