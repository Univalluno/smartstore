import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Obtener ruta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(" Directorio actual:", __dirname);
console.log(" Buscando .env.local en:", join(__dirname, ".env.local"));

// Cargar .env.local DESDE LA RUTA CORRECTA
const result = dotenv.config({ path: join(__dirname, ".env.local") });

if (result.error) {
  console.error(" ERROR cargando .env:", result.error.message);
} else {
  console.log(" .env cargado correctamente");
  console.log(" DATABASE_URL existe?:", !!process.env.DATABASE_URL);
  console.log(" DATABASE_URL valor:", process.env.DATABASE_URL || "(vacío)");
  console.log(" JWT_SECRET existe?:", !!process.env.JWT_SECRET);
}

// Probar también con process.cwd()
console.log("\n Probando con process.cwd():", process.cwd());
const result2 = dotenv.config({ path: join(process.cwd(), ".env.local") });
console.log("DATABASE_URL (cwd):", process.env.DATABASE_URL || "NO ENCONTRADA");
