import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: "postgresql://postgres:Univalle2025@localhost:5432/smartstore_test"
});
async function test() {
  try {
    const res = await pool.query("SELECT NOW() as time");
    console.log(" PostgreSQL CONECTADO - Hora:", res.rows[0].time);
  } catch (error) {
    console.log(" ERROR:", error.message);
  }
  pool.end();
}
test();
