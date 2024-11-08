import express from "express";
import cors from "cors";
import { tokenRouter } from "./Token/infrestructure/routes/tokenRouter";
import { RabbitMQConsumer } from "./Rabbitmq/infraestructure/rabbit/RabbitMQConsumer";
import { LeadCreatedConsumer } from "./Rabbitmq/infraestructure/rabbit/LeadCreatedConsumer";
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



/*

import { Signale } from "signale";
import express from "express";
import { tokenRouter } from "./Token/infrestructure/routes/tokenRouter";
import 'dotenv/config';
import cors from 'cors';
import { RabbitMQService } from "./Rabbitmq/infraestructure/rabbit/RabbitMQService";
import { TokenService } from "./Rabbitmq/domain/TokenService";
import { MongoTokenRepository } from "./Token/infrestructure/adapters/MongoTokenRepository";
import { EmailAdapter } from "./Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";

// Crear instancias de dependencias
const tokenRepository = new MongoTokenRepository();
const emailAdapter = new EmailAdapter();
const tokenService = new TokenService(tokenRepository, emailAdapter);

const app = express();
const signale = new Signale();
app.use(express.json());
app.use(cors());
app.use("/api/v1/token", tokenRouter);

const port = 3001;
const host = '0.0.0.0';

// Inicializar RabbitMQ y escuchar eventos
async function initializeRabbitMQ() {
  try {
    signale.pending("Conectando a RabbitMQ...");
    const channel = await RabbitMQService.getChannel();
    signale.success("Conexión exitosa a RabbitMQ");

    // Escuchar el evento de creación de usuario y procesarlo
    const userQueue = 'user.created';
    await channel.assertQueue(userQueue, { durable: true });
    channel.consume(userQueue, async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        signale.info("📥 Evento recibido en Notifications (user.created):", event);

        // Enviar el token de verificación al correo electrónico
        await tokenService.sendVerificationToken(event.email, event.userId);
        signale.success(`✔️ Correo de verificación enviado a ${event.email}`);

        // Confirmar el mensaje como procesado
        channel.ack(msg);
      }
    });
    signale.success(`Escuchando eventos en la cola ${userQueue}`);

    // Escuchar el evento de creación de lead y procesarlo
    const leadQueue = 'lead.created';
    await channel.assertQueue(leadQueue, { durable: true });
    channel.consume(leadQueue, async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        signale.info("📥 Evento recibido en Notifications (lead.created):", event);

        // Enviar mensaje de bienvenida (simulado)
        signale.success(`✔️ Mensaje de bienvenida enviado a ${event.email}`);

        // Confirmar el mensaje como procesado
        channel.ack(msg);
      }
    });
    signale.success(`Escuchando eventos en la cola ${leadQueue}`);
  } catch (error) {
    signale.error("Error al conectar a RabbitMQ:", error);
  }
}

// Inicializar servidor y RabbitMQ
app.listen(port, host, async () => {
  signale.success(`Server online on port ${port}`);
  await initializeRabbitMQ(); // Iniciar RabbitMQ al iniciar el servidor
});





*/ 










/*import { Signale } from "signale";
import express from "express";
import { tokenRouter } from "./Token/infrestructure/routes/tokenRouter";
import 'dotenv/config';
import cors from 'cors';
import { RabbitMQService } from "./Rabbitmq/infraestructure/rabbit/RabbitMQService";
import { TokenService } from "./Rabbitmq/domain/TokenService";
import { MongoTokenRepository } from "./Token/infrestructure/adapters/MongoTokenRepository";
import { EmailAdapter } from "./Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";


// Crear instancias de dependencias
const tokenRepository = new MongoTokenRepository();
const emailAdapter = new EmailAdapter();
const tokenService = new TokenService(tokenRepository, emailAdapter);

const app = express();
const signale = new Signale();
app.use(express.json());
app.use(cors());
app.use("/api/v1/token", tokenRouter);

const port = 3001;
const host = '0.0.0.0';

// Inicializar RabbitMQ y escuchar eventos
async function initializeRabbitMQ() {
  try {
    signale.pending("Conectando a RabbitMQ...");
    const channel = await RabbitMQService.getChannel();
    signale.success("Conexión exitosa a RabbitMQ");

    // Escuchar el evento de creación de usuario y procesarlo
    const queue = 'user.created';
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        signale.info("Evento recibido en Notifications:", event);

        // Enviar el token de verificación al correo electrónico
        await tokenService.sendVerificationToken(event.email, event.userId);

        // Confirmar el mensaje como procesado
        channel.ack(msg);
      }
    });
    signale.success(`Escuchando eventos en la cola ${queue}`);
  } catch (error) {
    signale.error("Error al conectar a RabbitMQ:", error);
  }
}

// Inicializar servidor y RabbitMQ
app.listen(port, host, async () => {
  signale.success(`Server online in port ${port}`);
  await initializeRabbitMQ(); // Iniciar RabbitMQ al iniciar el servidor
});


*/

















/*import { Signale } from "signale";
import express from "express";
import { tokenRouter } from "./Token/infrestructure/routes/tokenRouter";
import 'dotenv/config';
import cors from 'cors';

const app = express();
const signale = new Signale();
app.use(express.json());
app.use(cors());
app.use("/api/v1/token", tokenRouter);

const port = 3001;
const host = '0.0.0.0';

app.listen(port, host, () => {
  signale.success("Server online in port 3001");
});

*/