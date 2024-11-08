import { TokenRepository } from "../domain/TokenRepository";
import { EmailAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { RabbitMQPublisher } from "../../Rabbitmq/infraestructure/rabbit/RabbitMQPublisher";

export class ValidateUserTokenUseCase {
    constructor(
        private tokenRepository: TokenRepository,
        private emailAdapter: EmailAdapter,
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
        if (!email) {
            throw new Error("Correo no encontrado para el usuario.");
        }
    
        // Publicar el evento de activación del usuario en RabbitMQ
        await this.rabbitMQPublisher.publish("user.token.validated", { userUuid });
        console.log(`✔️ Evento 'user.token.validated' publicado para el usuario ${userUuid}`);        
    
        // Desactivar el token después de obtener el correo
        await this.tokenRepository.deactivateToken(tokenValue);
        console.log(`🚫 Token ${tokenValue} marcado como inactivo en MongoDB`);
    
        // Enviar el correo de confirmación de activación
        const subject = "Bienvenido a la aplicación";
        const message = `¡Felicidades! Tu cuenta ha sido activada y ya eres parte de la aplicación.`;
        await this.emailAdapter.sendEmail(email, subject, message);
        console.log(`Correo de activación enviado a ${email}`);
    }
}


