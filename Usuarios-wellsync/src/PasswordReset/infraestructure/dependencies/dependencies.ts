// dependencies.ts
import { MySQLPasswordResetRepository } from "../adapter/MySQLPasswordResetRepository";
import { PgUsersRepository } from "../../../User/infraestructure/adapters/PgUsersRepository";
import { PgLeadsRepository } from "../../../Contacts/infrestructure/adapters/pgLeadsRepository";
import { RabbitMQPublisher } from "../../../User/infraestructure/rabbitmq/RabbitMQPublisher";

// Casos de uso
import { CreatePasswordResetUseCase } from "../../application/CreatePasswordResetUseCase";
import { ValidateTokenUseCase } from "../../application/ValidateTokenUseCase";
import { ResetPasswordUseCase } from "../../application/ResetPasswordUseCase";

// Controladores
import { CreatePasswordResetController } from "../controllers/CreatePasswordResetController";
import { ValidateTokenController } from "../controllers/ValidateTokenController";
import { ResetPasswordController } from "../controllers/ResetPasswordController";

// Repositorios
export const passwordResetRepository = new MySQLPasswordResetRepository();
export const usersRepository = new PgUsersRepository();
export const leadsRepository = new PgLeadsRepository(); // Instancia de la implementación concreta

// RabbitMQ Publisher
export const rabbitMQPublisher = new RabbitMQPublisher();

// Casos de uso
export const createPasswordResetUseCase = new CreatePasswordResetUseCase(
    passwordResetRepository,
    usersRepository,
    leadsRepository,
    rabbitMQPublisher
);

export const validateTokenUseCase = new ValidateTokenUseCase(
    passwordResetRepository,
    usersRepository
);

export const resetPasswordUseCase = new ResetPasswordUseCase(
    passwordResetRepository,
    usersRepository
);

// Controladores
export const createPasswordResetController = new CreatePasswordResetController(createPasswordResetUseCase);
export const validateTokenController = new ValidateTokenController(validateTokenUseCase);
export const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);












