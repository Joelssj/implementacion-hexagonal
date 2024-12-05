import dotenv from "dotenv";
import { Pool } from "pg";
import { Signale } from "signale";

// Cargar variables de entorno desde el archivo .env
dotenv.config();
const signale = new Signale();

// Configuración de la conexión con PostgreSQL
const sslConfig = process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {};

// Crear configuración del pool de conexiones
const config = {
  host: process.env.DB_HOST,          // Host de la base de datos (ejemplo: 'database-well.cde8y6oc25ot.us-east-1.rds.amazonaws.com')
  user: process.env.DB_USER,          // Usuario de la base de datos
  database: process.env.DB_DATABASE,  // Nombre de la base de datos
  password: process.env.DB_PASSWORD,  // Contraseña de la base de datos
  port: parseInt(process.env.DB_PORT || "5432"),  // Puerto de la base de datos (por defecto 5432)
  ...sslConfig,                       // Incluir la configuración SSL si se necesita
};

// Crear el pool de conexiones
const pool = new Pool(config);

// Función para probar la conexión a la base de datos
async function testConnection() {
  try {
    const client = await pool.connect();
    signale.success("Conexión exitosa a la BD de PostgreSQL");
    console.log("PostgreSQL conectado correctamente");
    client.release();  // Liberar el cliente después de la conexión
  } catch (error) {
    signale.error("Error al conectar a la BD:", error);
    console.error("Error al conectar a la BD:", error);
  }
}

// Llamar a la función de prueba de conexión
testConnection();

// Función para realizar consultas a la base de datos
export async function query(sql: string, params: any[]) {
  try {
    const client = await pool.connect();
    const result = await client.query(sql, params);
    client.release();  // Liberar el cliente después de la consulta
    return result;     // Devolver el resultado de la consulta
  } catch (error) {
    signale.error(error);
    return null;  // Devolver null si ocurre un error
  }
}







