// Importar repositorios y casos de uso necesarios
import { MongoTokenRepository } from "../adapters/MongoTokenRepository";
import { ValidateUserTokenUseCase } from "../../application/ValidateTokenUseCase";
import { ValidateUserTokenController } from "../controllers/TokenController";
import { EmailAdapter } from "../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter"; 
import { RabbitMQPublisher } from "../../../Rabbitmq/infraestructure/rabbit/RabbitMQPublisher";
import { TwilioAdapter } from "../../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter";

// Crear repositorios y adaptadores
const tokenRepository = new MongoTokenRepository();
const emailAdapter = new EmailAdapter();
const twilioAdapter = new TwilioAdapter();  // Adaptador para Twilio
const rabbitMQPublisher = new RabbitMQPublisher(); // Adaptador para RabbitMQ

// Crear el caso de uso para validar el token con RabbitMQ
const validateTokenUseCase = new ValidateUserTokenUseCase(
    tokenRepository, 
    emailAdapter, 
    twilioAdapter,      // Aquí debe ir TwilioAdapter para enviar mensajes de WhatsApp
    rabbitMQPublisher        // Adaptador de Twilio para enviar mensajes
);

// Crear el controlador de Token
export const tokenController = new ValidateUserTokenController(validateTokenUseCase);


