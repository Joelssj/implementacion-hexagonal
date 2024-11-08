import { TwilioRepository } from "../domain/TwilioRepository"; // Cambia a TwilioRepository
import { TokenRepository } from "../../../Token/domain/TokenRepository";
import { Token } from "../../../Token/domain/Token";
import { v4 as uuidv4 } from 'uuid';
import { MessageLog } from "../../WhatsApp/domain/Twillio"; // Asegúrate de que MessageLog esté correctamente importado

export class SendVerificationCodeUseCase {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly twilioRepository: TwilioRepository // Usa TwilioRepository en lugar de TwilioAdapter
    ) {}

    async run(nombre: string, apellido: string, correo: string, numero: string): Promise<MessageLog> {
        const leadUuid = uuidv4(); 

        // Generar el token de verificación y guardarlo en la tabla de tokens
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const token = new Token(uuidv4(), leadUuid, tokenValue, new Date(Date.now() + 3600 * 1000)); // Expira en 1 hora
        await this.tokenRepository.saveToken(token);

        // Crear el mensaje de verificación y enviarlo a través del TwilioRepository
        const message = `¡Bienvenido, ${nombre}! Tu token de verificación es: ${tokenValue}`;
        const messageLog = await this.twilioRepository.sendMessage(numero, message); // Ahora retorna un MessageLog con fecha y metadata

        // Retornar el registro del mensaje que incluye fecha y metadata
        return messageLog;
    }
}
