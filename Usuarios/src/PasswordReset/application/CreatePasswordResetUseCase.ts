import { UsersRepository } from "../../User/domain/UsersRepository";
import { LeadsRepository } from "../../Contacts/domain/LeadsRepository";
import { PasswordResetRepository } from "../domain/PasswordResetRepository";
import { RabbitMQPublisher } from "../../User/infraestructure/rabbitmq/RabbitMQPublisher";

export class CreatePasswordResetUseCase {
    constructor(
        private readonly passwordResetRepository: PasswordResetRepository,
        private readonly usersRepository: UsersRepository,
        private readonly leadsRepository: LeadsRepository,
        private readonly rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run(email: string, notificationPreference: 'email' | 'whatsapp'): Promise<void> { // Agrega `notificationPreference`
        // Verificar si el usuario existe en la base de datos
        const user = await this.usersRepository.getUserByEmail(email);
        if (!user) {
            throw new Error("No se encontró ningún usuario con ese correo.");
        }

        // Sobrescribir la preferencia de notificación del usuario si se proporciona en la solicitud
        const userNotificationPreference = notificationPreference || user.notificationPreference;
        
        console.log(`Preferencia de notificación para ${email}: ${userNotificationPreference}`);

        // Generar un token de 4 dígitos
        const token = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora

        // Guardar el token en el repositorio de reseteo de contraseña
        await this.passwordResetRepository.savePasswordReset({
            correo: email,
            token,
            createdAt: new Date(),
            expiresAt
        });

        // Obtener el número de teléfono del Lead solo si la preferencia es WhatsApp
        let phone: string | undefined;
        if (userNotificationPreference === 'whatsapp') {
            const lead = await this.leadsRepository.getByEmail(email);
            if (!lead || !lead.phone) {
                throw new Error("No se encontró un número de teléfono para el usuario.");
            }
            phone = lead.phone;
            console.log(`Número de teléfono para ${email}: ${phone}`);
        }

        // Crear el mensaje a enviar a RabbitMQ
        const message = {
            email,
            token,
            subject: "Recuperación de contraseña",
            body: `Tu código de verificación es: ${token}. Este código expirará en 1 hora.`,
            phone, // Incluye el número de teléfono si es necesario
            notificationPreference: userNotificationPreference
        };

        // Publicar el mensaje en RabbitMQ
        await this.rabbitMQPublisher.publish("password_reset_notifications", message);
        console.log(`Token de recuperación enviado a través de ${userNotificationPreference} para ${email}.`);
    }
}













/*import { PasswordResetRepository } from "../domain/PasswordResetRepository";
import { PasswordReset } from "../domain/PasswordReset";
import { RabbitMQPublisher } from "../../User/infraestructure/rabbitmq/RabbitMQPublisher";
import { UsersRepository } from "../../User/domain/UsersRepository";

export class CreatePasswordResetUseCase {
    constructor(
        private readonly passwordResetRepository: PasswordResetRepository,
        private readonly usersRepository: UsersRepository,
        private readonly rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run(email: string): Promise<void> {
        const user = await this.usersRepository.getUserByEmail(email);
        if (!user) {
            throw new Error("No se encontró ningún usuario con ese correo.");
        }

        const token = Math.floor(1000 + Math.random() * 9000).toString(); // Generar token de 4 dígitos
        const expiresAt = new Date(Date.now() + 3600000); // Expira en 1 hora
        const passwordReset = new PasswordReset(email, token, new Date(), expiresAt);

        await this.passwordResetRepository.savePasswordReset(passwordReset);

        // Publicar el evento en RabbitMQ
        const message = {
            email,
            subject: 'Recuperación de contraseña',
            body: `Tu código de verificación es: ${token}. Este código expirará en 1 hora.`
        };

        await this.rabbitMQPublisher.publish("password_reset_notifications", message);
        console.log("Token de verificación enviado a RabbitMQ:", token); // Log para verificar el valor del token
    }
}*/






