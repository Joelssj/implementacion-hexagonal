import { TokenRepository } from "../domain/TokenRepository";
import { EmailAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { RabbitMQPublisher } from "../../Rabbitmq/infraestructure/rabbit/RabbitMQPublisher";
import { TwilioAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter";  // Asegúrate de tener la ruta correcta al TwilioAdapter

export class ValidateUserTokenUseCase {
    constructor(
        private tokenRepository: TokenRepository,
        private emailAdapter: EmailAdapter,
        private twilioAdapter: TwilioAdapter,  // Utilizamos TwilioAdapter para enviar WhatsApp
        private rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run(userUuid: string, tokenValue: string): Promise<void> {
        // Obtener el token y verificar que esté activo
        const tokenData = await this.tokenRepository.getTokenByUserUuid(userUuid);
        if (!tokenData || tokenData.token !== tokenValue || !tokenData.isActive) {
            throw new Error("Token inválido o expirado.");
        }
    
        // Obtener el correo del usuario antes de desactivar el token
        const email = await this.tokenRepository.getUserEmailByUuid(userUuid);
        let recipient: string | null = null;

        if (email) {
            recipient = email;
        } else {
            // Si no se encuentra el correo, buscamos el teléfono
            const phone = await this.tokenRepository.getUserPhoneByUuid(userUuid);
            if (phone) {
                recipient = phone;
            } else {
                throw new Error("Ni el correo ni el teléfono fueron encontrados para el usuario.");
            }
        }
    
        // Publicar el evento de activación del usuario en RabbitMQ
        await this.rabbitMQPublisher.publish("user.token.validated", { userUuid });
        console.log(`✔️ Evento 'user.token.validated' publicado para el usuario ${userUuid}`);        
    
        // Desactivar el token después de obtener el correo o teléfono
        await this.tokenRepository.deactivateToken(tokenValue);
        console.log(`🚫 Token ${tokenValue} marcado como inactivo en MongoDB`);
    
        // Enviar la notificación de activación (por email o teléfono)
        const subject = "Bienvenido a la aplicación";
        const message = `¡Felicidades! Tu cuenta ha sido activada y ya eres parte de la aplicación.`;
        
        if (recipient === email) {
            // Enviar el correo de confirmación de activación
            await this.emailAdapter.sendEmail(email, subject, message);
            console.log(`Correo de activación enviado a ${email}`);
        } else {
            // Enviar la notificación por WhatsApp usando Twilio
            await this.twilioAdapter.sendMessage(recipient, message);  // TwilioAdapter se encarga de enviar el mensaje
            console.log(`Notificación enviada a través de WhatsApp al número ${recipient}`);
        }
    }
}






