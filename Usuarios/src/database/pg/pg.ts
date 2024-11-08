import dotenv from "dotenv";
import { Pool } from "pg";
import { Signale } from "signale";

dotenv.config();
const signale = new Signale();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
};

const pool = new Pool(config);

async function testConnection() {
  try {
    const client = await pool.connect();
    signale.success("Conexión exitosa a la BD de PostgreSQL");
    console.log("PostgreSQL conectado correctamente");
    client.release();
  } catch (error) {
    signale.error("Error al conectar a la BD:", error);
    console.error("Error al conectar a la BD:", error);
  }
}

testConnection();

export async function query(sql: string, params: any[]) {
  try {
    const client = await pool.connect();
    const result = await client.query(sql, params);
    client.release();
    return result;
  } catch (error) {
    signale.error(error);
    return null;
  }
}
