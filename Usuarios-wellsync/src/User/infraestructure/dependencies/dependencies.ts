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
import { PostgresAuditLogRepository } from "../../../AuditLog/infraestructure/adapters/PostgresAuditLogRepository";
import { AuditService } from "../../../AuditLog/infraestructure/services/AuditService";

// Repositorios
export const usersRepository = new PgUsersRepository();
export const leadsRepository = new PgLeadsRepository();
export const rabbitMQPublisher = new RabbitMQPublisher();
const auditLogRepository = new PostgresAuditLogRepository();

// Casos de uso
export const createUserUseCase = new CreateUserUseCase(usersRepository, leadsRepository, rabbitMQPublisher); // Caso de uso de creación de usuario sin token ni notificaciones
export const getUserByUuidUseCase = new GetUserByUuidUseCase(usersRepository);
export const deleteUserByUuidUseCase = new DeleteUserByUuidUseCase(usersRepository);
export const updateUserByUuidUseCase = new UpdateUserByUuidUseCase(usersRepository);
export const loginUseCase = new LoginUseCase(usersRepository);
export const auditService = new AuditService(auditLogRepository);

// Controladores
export const createUserController = new CreateUserController(createUserUseCase); // Controlador de creación de usuario
export const loginController = new LoginController(loginUseCase, auditService);  // Inyectamos auditService en LoginController
export const getUserByUuidController = new GetUserByUuidController(getUserByUuidUseCase);
export const deleteUserByUuidController = new DeleteUserByUuidController(deleteUserByUuidUseCase);
export const updateUserByUuidController = new UpdateUserByUuidController(updateUserByUuidUseCase);














