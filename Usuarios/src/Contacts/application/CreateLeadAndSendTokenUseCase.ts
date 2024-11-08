// CreateLeadUseCase.ts
import { LeadsRepository } from "../domain/LeadsRepository";
import { Lead } from "../domain/Lead";
import { v4 as uuidv4 } from "uuid";
import { RabbitMQPublisher } from "../../User/infraestructure/rabbitmq/RabbitMQPublisher";

// Definimos el tipo específico para notification_preference
type NotificationPreference = "email" | "whatsapp";

export class CreateLeadUseCase {
    constructor(
        private readonly leadsRepository: LeadsRepository,
        private readonly rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run({ first_Name, last_Name, correo, phone, notification_preference }: { first_Name: string; last_Name: string; correo: string; phone: string; notification_preference: NotificationPreference }): Promise<Lead> {
        if (!correo) {
            throw new Error("El campo 'correo' es obligatorio.");
        }

        // Verificar que la preferencia de notificación sea válida
        if (!["email", "whatsapp"].includes(notification_preference)) {
            throw new Error("La preferencia de notificación debe ser 'email' o 'whatsapp'.");
        }

        const uuid = uuidv4();
        const lead = new Lead(uuid, first_Name, last_Name, correo, phone, notification_preference);
        
        await this.leadsRepository.saveLead(lead);

        // Publicar el evento en RabbitMQ con la preferencia de notificación
        const event = {
            leadUuid: uuid,
            firstName: first_Name,
            lastName: last_Name,
            correo: correo,
            phone: phone,
            notification_preference: notification_preference  // Asegúrate de incluir este campo
        };
        await this.rabbitMQPublisher.publish("lead.created", event);
        console.log(`Evento 'lead.created' publicado en RabbitMQ con datos: ${JSON.stringify(event)}`);

        return lead;
    }
}




/*
// CreateLeadUseCase.ts
import { LeadsRepository } from "../domain/LeadsRepository";
import { Lead } from "../domain/Lead";
import { v4 as uuidv4 } from "uuid";
import { RabbitMQPublisher } from "../../User/infraestructure/rabbitmq/RabbitMQPublisher";


export class CreateLeadUseCase {
    constructor(
        private readonly leadsRepository: LeadsRepository,
        private readonly rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run({ first_Name, last_Name, email, phone }: { first_Name: string; last_Name: string; email: string; phone: string }): Promise<Lead> {
        if (!email) {
            throw new Error("El campo 'email' es obligatorio.");
        }

        const uuid = uuidv4();
        const lead = new Lead(uuid, first_Name, last_Name, email, phone);
        
        await this.leadsRepository.saveLead(lead);

        // Verificar que rabbitMQPublisher esté definido antes de usar publish
        if (!this.rabbitMQPublisher) {
            throw new Error("RabbitMQPublisher no está inicializado");
        }
        
        const event = {
            leadUuid: uuid,
            firstName: first_Name,
            lastName: last_Name,
            email: email
        };
        await this.rabbitMQPublisher.publish("lead.created", event);
        console.log(`Evento 'lead.created' publicado en RabbitMQ con datos: ${JSON.stringify(event)}`);

        return lead;
    }
}*/


