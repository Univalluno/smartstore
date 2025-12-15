import mysql from 'mysql2/promise';

async function test() {
  console.log('Intentando conectar a MySQL de XAMPP...');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',  // XAMPP usualmente sin password
    });
    console.log('✅ Conectado a MySQL de XAMPP');
    
    // Intentar crear la base de datos si no existe
    await connection.query('CREATE DATABASE IF NOT EXISTS smartstore');
    console.log('✅ Base de datos "smartstore" lista');
    
    await connection.end();
  } catch (error) {
    console.log('❌ ERROR:');
    console.log('Mensaje:', error.message);
    console.log('Verifica que:');
    console.log('1. XAMPP está corriendo');
    console.log('2. MySQL está activo en XAMPP');
    console.log('3. Puerto 3306 está abierto');
  }
}

test();