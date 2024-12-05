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

        // Validar el formato del correo electrónico
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(correo)) {
            throw new Error("El correo electrónico no tiene un formato válido.");
        }

        // Validar que el nombre tenga al menos 4 caracteres
        if (first_Name.length < 4) {
            throw new Error("El nombre debe tener al menos 4 caracteres.");
        }

        // Validar que el apellido tenga al menos 4 caracteres
        if (last_Name.length < 4) {
            throw new Error("El apellido debe tener al menos 4 caracteres.");
        }

        // Validar que el teléfono tenga exactamente 10 dígitos
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("El número de teléfono debe tener exactamente 10 dígitos.");
        }

        // Verificar si el correo o el teléfono ya están registrados
        const existingLeadByEmail = await this.leadsRepository.getByEmail(correo);
        if (existingLeadByEmail) {
            throw new Error("El correo ya está registrado.");
        }

        const existingLeadByPhone = await this.leadsRepository.getByPhone(phone);
        if (existingLeadByPhone) {
            throw new Error("El número de teléfono ya está registrado.");
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
            notification_preference: notification_preference
        };
        await this.rabbitMQPublisher.publish("lead.created", event);
        console.log(`Evento 'lead.created' publicado en RabbitMQ con datos: ${JSON.stringify(event)}`);

        return lead;
    }
}








