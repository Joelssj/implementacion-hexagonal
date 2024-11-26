// src/database/mongodb/mongodb.ts
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { Signale } from 'signale';

const signale = new Signale();

const client = new MongoClient(process.env.MONGODB_URI!); // La URI completa está en .env

export async function connectToMongoDB() {
    try {
        await client.connect();
        signale.success("Conexión exitosa a la BD de MongoDB");
        console.log("✔️  MongoDB conectado satisfactoriamente.");
    } catch (error) {
        signale.error("Error al conectar a la BD de MongoDB:", error);
    }
}

export function getMongoDB() {
    const db = client.db(); // Acceso directo a la base de datos según URI
    console.log(`🔗 Accediendo a la base de datos MongoDB: ${db.databaseName}`);
    return db;
}

// Llama a esta función para verificar la conexión
connectToMongoDB();
