import express from "express";
import cors from "cors";
import { tokenRouter } from "./Token/infrestructure/routes/tokenRouter";
import { RabbitMQConsumer } from "./Rabbitmq/infraestructure/rabbit/RabbitMQConsumer";
import { LeadCreatedConsumer } from "./Rabbitmq/infraestructure/rabbit/LeadCreatedConsumer";
import { PasswordResetConsumer } from "./Rabbitmq/infraestructure/rabbit/PasswordResetConsumer";
import { MongoTokenRepository } from "./Token/infrestructure/adapters/MongoTokenRepository";
import { TokenService } from "./Rabbitmq/domain/TokenService";
import { EmailAdapter } from "./Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { TwilioAdapter } from "./Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter";
import "dotenv/config";

// Crear instancias de dependencias
const tokenRepository = new MongoTokenRepository();
const emailAdapter = new EmailAdapter();
const twilioAdapter = new TwilioAdapter();
const tokenService = new TokenService(tokenRepository, emailAdapter, twilioAdapter);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/token", tokenRouter);

const port = 3001;
const host = "0.0.0.0";

// Inicializar consumidores de RabbitMQ
async function initializeRabbitMQConsumers() {
  try {
    console.log("🔄 Intentando conectar a RabbitMQ...");

    // Inicializar el consumidor de `user.created`
    const rabbitMQConsumer = new RabbitMQConsumer();
    await rabbitMQConsumer.consumeUserCreatedEvent();
    console.log("✔️ Consumidor de user.created inicializado y escuchando eventos.");

    // Inicializar el consumidor de `lead.created`
    const leadCreatedConsumer = new LeadCreatedConsumer();
    await leadCreatedConsumer.consume();
    console.log("✔️ Consumidor de lead.created inicializado y escuchando eventos.");

    // Inicializar el consumidor de `password_reset_notifications`
    const passwordResetConsumer = new PasswordResetConsumer(); // Pasar `emailAdapter` como dependencia
    await passwordResetConsumer.consumePasswordResetEvent();
    console.log("✔️ Consumidor de password_reset_notifications inicializado y escuchando eventos.");

    console.log("✅ Conexión a RabbitMQ y consumidores inicializados correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar a RabbitMQ o inicializar consumidores:", error);
  }
}

// Inicializar servidor y consumidores de RabbitMQ
app.listen(port, host, async () => {
  console.log(`🚀 Server online on port ${port}`);
  await initializeRabbitMQConsumers(); // Iniciar consumidores al iniciar el servidor
});

// Captura de errores globales para ver cualquier problema no manejado
process.on("unhandledRejection", (error) => {
  console.error("⚠️ Unhandled Rejection:", error);
});
process.on("uncaughtException", (error) => {
  console.error("⚠️ Uncaught Exception:", error);
});





