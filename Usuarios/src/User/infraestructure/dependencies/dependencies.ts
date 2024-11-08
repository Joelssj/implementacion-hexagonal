// Importaciones actualizadas sin tokens ni notificaciones
import { PgUsersRepository } from "../adapters/PgUsersRepository"; // Cambié MySQL a Pg para PostgreSQL
import { CreateUserUseCase } from "../../application/CreateUserAndSendTokenUseCase";
import { CreateUserController } from "../controllers/CreateUserController"; // Controlador de creación de usuario

import { LoginUseCase } from "../../application/LoginUseCase";
import { LoginController } from "../controllers/LoginController";
import { GetUserByUuidUseCase } from "../../application/GetUserByUuidUseCase";
import { GetUserByUuidController } from "../controllers/GetUserByUuidController";
import { DeleteUserByUuidUseCase } from "../../application/DeleteUserByUuidUseCase";
import { DeleteUserByUuidController } from "../controllers/DeleteUserByUuidController";
import { UpdateUserByUuidUseCase } from "../../application/UpdateUserByUuidUseCase";
import { UpdateUserByUuidController } from "../controllers/UpdateUserByUuidController";
import { PgLeadsRepository } from "../../../Contacts/infrestructure/adapters/pgLeadsRepository";
import { RabbitMQPublisher } from "../rabbitmq/RabbitMQPublisher";

// Repositorio
export const usersRepository = new PgUsersRepository();
export const leadsRepository = new PgLeadsRepository();
export const rabbitMQPublisher = new RabbitMQPublisher();
// Casos de uso
export const createUserUseCase = new CreateUserUseCase(usersRepository, leadsRepository, rabbitMQPublisher); // Caso de uso de creación de usuario sin token ni notificaciones
export const getUserByUuidUseCase = new GetUserByUuidUseCase(usersRepository);
export const deleteUserByUuidUseCase = new DeleteUserByUuidUseCase(usersRepository);
export const updateUserByUuidUseCase = new UpdateUserByUuidUseCase(usersRepository);
export const loginUseCase = new LoginUseCase(usersRepository);

// Controladores
export const createUserController = new CreateUserController(createUserUseCase); // Controlador de creación de usuario
export const loginController = new LoginController(loginUseCase);   
export const getUserByUuidController = new GetUserByUuidController(getUserByUuidUseCase);
export const deleteUserByUuidController = new DeleteUserByUuidController(deleteUserByUuidUseCase);
export const updateUserByUuidController = new UpdateUserByUuidController(updateUserByUuidUseCase);





/*

//import { MySQLLeadsRepository } from "../../../Lead/infrestructure/adapters/MsqlLeadsRepository";
import { MySQLUsersRepository } from "../adapters/MysqlUsersRepository";
import { MySQLTokenRepository } from "../../../Token/infrestructure/adapters/MysqlTokenrepository";
//import { CreateUserAndSendTokenUseCase } from "../../application/CreateUserAndSendTokenUseCase";
import { ValidateUserTokenUseCase } from "../../../Token/application/ValidateTokenUseCase";
//import { CreateUserController } from "../controllers/CreateUserController";
import { ValidateUserTokenController } from "../../../Token/infrestructure/controllers/TokenController";
import { TwilioAdapter } from "../../../Notifications/infraestructure/adapters/TwilioAdapter";
import { EmailAdapter } from "../../../Notifications/infraestructure/adapters/EmailAdapter"; 
import { LoginUseCase } from "../../application/LoginUseCase";
import { LoginController } from "../controllers/LoginController";
import { GetUserByUuidUseCase } from "../../application/GetUserByUuidUseCase";
import { GetUserByUuidController } from "../controllers/GetUserByUuidController";
import { DeleteUserByUuidUseCase } from "../../application/DeleteUserByUuidUseCase";
import { DeleteUserByUuidController } from "../controllers/DeleteUserByUuidController";
import { UpdateUserByUuidUseCase } from "../../application/UpdateUserByUuidUseCase";
import { UpdateUserByUuidController } from "../controllers/UpdateUserByUuidController";


// Repositorios
//export const leadsRepository = new MySQLLeadsRepository();
export const usersRepository = new MySQLUsersRepository();
export const tokenRepository = new MySQLTokenRepository();
export const twilioAdapter = new TwilioAdapter();
export const emailAdapter = new EmailAdapter();  

// Casos de uso
export const createUserAndSendTokenUseCase = new CreateUserAndSendTokenUseCase(
    usersRepository,     // Repositorio de usuarios
    tokenRepository,     // Repositorio de tokens
 //   leadsRepository,     // Repositorio de leads
    twilioAdapter        // Adaptador de Twilio
);

export const getUserByUuidUseCase = new GetUserByUuidUseCase(usersRepository);
export const deleteUserByUuidUseCase = new DeleteUserByUuidUseCase(usersRepository);
export const updateUserByUuidUseCase = new UpdateUserByUuidUseCase(usersRepository);
export const loginUseCase = new LoginUseCase(usersRepository);

export const validateUserTokenUseCase = new ValidateUserTokenUseCase(
    tokenRepository, 
    usersRepository,
    emailAdapter 
);

// Controladores
export const createUserController = new CreateUserController(createUserAndSendTokenUseCase);
export const validateUserTokenController = new ValidateUserTokenController(validateUserTokenUseCase);
export const loginController = new LoginController(loginUseCase);   
export const getUserByUuidController = new GetUserByUuidController(getUserByUuidUseCase);
export const deleteUserByUuidController = new DeleteUserByUuidController(deleteUserByUuidUseCase);
export const updateUserByUuidController = new UpdateUserByUuidController(updateUserByUuidUseCase);*/