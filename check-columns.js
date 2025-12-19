import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function check() {
  const res = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    ORDER BY ordinal_position
  `);
  
  console.log("Columnas de tabla 'users':");
  res.rows.forEach(col => {
    console.log(`  ${col.column_name} (${col.data_type})`);
  });
  
  pool.end();
}

check();
