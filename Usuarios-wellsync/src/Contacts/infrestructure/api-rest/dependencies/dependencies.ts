
import { PgLeadsRepository } from "../../adapters/pgLeadsRepository"; // Cambiado a PgLeadsRepository
import { CreateLeadUseCase } from "../../../application/CreateLeadAndSendTokenUseCase";
import { CreateLeadController } from "../controllers/CreateLeadController";
import { GetLeadByUuidUseCase } from "../../../application/GetLeadByUuidUseCase";
import { GetLeadByUuidController } from "../controllers/GetLeadByUuidController";
import { DeleteLeadByUuidUseCase } from "../../../application/DeleteLeadByUuidUseCase";
import { DeleteLeadByUuidController } from "../controllers/DeleteLeadByUuidController";
import { RabbitMQPublisher } from "../../../../User/infraestructure/rabbitmq/RabbitMQPublisher";
import { UpdateLeadController } from "../controllers/UpdateLeadController";
import { UpdateLeadUseCase } from "../../../application/UpdateLeadUseCase";
import { GetAllLeadsUseCase } from "../../../application/GetAllLeadsUseCase"; // Nuevo caso de uso
import { GetAllLeadsController } from "../controllers/GetAllLeadsController";


export const leadsRepository = new PgLeadsRepository(); // Cambiado a PgLeadsRepository
export const rabbitMQPublisher = new RabbitMQPublisher();

export const createLeadUseCase = new CreateLeadUseCase(leadsRepository, rabbitMQPublisher);
export const getLeadByUuidUseCase = new GetLeadByUuidUseCase(leadsRepository);
export const deleteLeadByUuidUseCase = new DeleteLeadByUuidUseCase(leadsRepository);
export const updateLeadUseCase = new UpdateLeadUseCase(leadsRepository, rabbitMQPublisher);
export const getAllLeadsUseCase = new GetAllLeadsUseCase(leadsRepository); 

export const createLeadController = new CreateLeadController(createLeadUseCase);
export const getLeadByUuidController = new GetLeadByUuidController(getLeadByUuidUseCase);
export const deleteLeadByUuidController = new DeleteLeadByUuidController(deleteLeadByUuidUseCase);
export const updateLeadController = new UpdateLeadController(updateLeadUseCase);
export const getAllLeadsController = new GetAllLeadsController(getAllLeadsUseCase);




