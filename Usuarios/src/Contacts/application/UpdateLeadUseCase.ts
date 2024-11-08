import { LeadsRepository } from "../domain/LeadsRepository";
import { Lead } from "../domain/Lead";
import { RabbitMQPublisher } from "../../User/infraestructure/rabbitmq/RabbitMQPublisher";

export class UpdateLeadUseCase {
    constructor(
        private readonly leadsRepository: LeadsRepository,
        private readonly rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run({
        uuid,
        first_Name,
        last_Name,
        email,
        phone,
        notificationPreference = null
    }: {
        uuid: string;
        first_Name: string;
        last_Name: string;
        email: string;
        phone: string;
        notificationPreference?: "email" | "whatsapp" | null;
    }): Promise<Lead> {
        if (!uuid) {
            throw new Error("El campo 'uuid' es obligatorio para actualizar un Lead.");
        }

        const existingLead = await this.leadsRepository.getLeadByUuid(uuid);
        if (!existingLead) {
            throw new Error(`No se encontró un Lead con UUID: ${uuid}`);
        }

        // Si notificationPreference es nulo, utiliza el valor actual del Lead existente
        const updatedNotificationPreference = notificationPreference !== null ? notificationPreference : existingLead.notificationPreference;

        const updatedLead = new Lead(uuid, first_Name, last_Name, email, phone, updatedNotificationPreference);

        await this.leadsRepository.updateLead(updatedLead);

        if (this.rabbitMQPublisher) {
            const event = {
                leadUuid: uuid,
                firstName: first_Name,
                lastName: last_Name,
                email: email,
                notificationPreference: updatedNotificationPreference // Incluye la preferencia de notificación en el evento
            };
            await this.rabbitMQPublisher.publish("lead.updated", event);
            console.log(`Evento 'lead.updated' publicado en RabbitMQ con datos: ${JSON.stringify(event)}`);
        }

        return updatedLead;
    }
}



/*
// UpdateLeadUseCase.ts
import { LeadsRepository } from "../domain/LeadsRepository";
import { Lead } from "../domain/Lead";
import { RabbitMQPublisher } from "../../User/infraestructure/rabbitmq/RabbitMQPublisher";

export class UpdateLeadUseCase {
    constructor(
        private readonly leadsRepository: LeadsRepository,
        private readonly rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run({ uuid, first_Name, last_Name, email, phone }: { uuid: string; first_Name: string; last_Name: string; email: string; phone: string }): Promise<Lead> {
        if (!uuid) {
            throw new Error("El campo 'uuid' es obligatorio para actualizar un Lead.");
        }

        const existingLead = await this.leadsRepository.getLeadByUuid(uuid);
        if (!existingLead) {
            throw new Error(`No se encontró un Lead con UUID: ${uuid}`);
        }

        const updatedLead = new Lead(uuid, first_Name, last_Name, email, phone);

        await this.leadsRepository.updateLead(updatedLead);

        if (this.rabbitMQPublisher) {
            const event = {
                leadUuid: uuid,
                first_Name,
                last_Name,
                email
            };
            await this.rabbitMQPublisher.publish("lead.updated", event);
            console.log(`Evento 'lead.updated' publicado en RabbitMQ con datos: ${JSON.stringify(event)}`);
        }

        return updatedLead;
    }
}
*/