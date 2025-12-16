import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "DB ERROR" });
  }
}
