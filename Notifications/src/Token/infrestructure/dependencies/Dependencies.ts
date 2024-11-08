// Importar repositorios y casos de uso necesarios
import { MongoTokenRepository } from "../adapters/MongoTokenRepository";
import { ValidateUserTokenUseCase } from "../../application/ValidateTokenUseCase";
import { ValidateUserTokenController } from "../controllers/TokenController";
import { EmailAdapter } from "../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter"; 
import { RabbitMQPublisher } from "../../../Rabbitmq/infraestructure/rabbit/RabbitMQPublisher";


// Crear repositorios y adaptadores
const tokenRepository = new MongoTokenRepository();
const emailAdapter = new EmailAdapter();
const rabbitMQPublisher = new RabbitMQPublisher(); // Instancia para enviar eventos a RabbitMQ

// Crear el caso de uso para validar el token con RabbitMQ
const validateTokenUseCase = new ValidateUserTokenUseCase(tokenRepository, emailAdapter, rabbitMQPublisher);

// Crear el controlador de Token
export const tokenController = new ValidateUserTokenController(validateTokenUseCase);






/*// Importar repositorios y casos de uso necesarios
import { MySQLTokenRepository } from "../adapters/MysqlTokenrepository";
import { ValidateUserTokenUseCase } from "../../application/ValidateTokenUseCase";
import { ValidateUserTokenController } from "../controllers/TokenController";
import { EmailAdapter } from "../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter"; 

// Crear repositorios
const tokenRepository = new MySQLTokenRepository();
const userRepository = new MySQLUsersRepository();
const emailAdapter = new EmailAdapter();  

// Crear el caso de uso para validar el token
const validateTokenUseCase = new ValidateUserTokenUseCase(tokenRepository, userRepository, emailAdapter);

// Crear el controlador de Token
export const tokenController = new ValidateUserTokenController(validateTokenUseCase);
*/