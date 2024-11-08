import { TokenRepository } from "../../Token/domain/TokenRepository";
import { EmailAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { TwilioAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter";
import { v4 as uuidv4 } from "uuid";

export class TokenService {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly emailAdapter: EmailAdapter,
        private readonly whatsappAdapter: TwilioAdapter // Agregar el adaptador de WhatsApp
    ) {}

    async sendVerificationToken(email: string, userId: string): Promise<void> {
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const token = {
            uuid: uuidv4(),
            userUuid: userId,
            email: email,
            token: tokenValue,
            expiresAt: new Date(Date.now() + 3600 * 1000),
            isActive: true
        };

        await this.tokenRepository.saveToken(token);
        console.log(`✅ Token guardado en MongoDB para el usuario ${userId}`);

        const message = `Su código de verificación es: ${tokenValue}`;
        await this.emailAdapter.sendEmail(email, "Código de Verificación", message);
        console.log(`✔️ Correo enviado a ${email} con el token de verificación.`);
    }

    async sendTokenViaWhatsApp(phone: string, userId: string): Promise<void> {
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const token = {
            uuid: uuidv4(),
            userUuid: userId,
            phone: phone,
            token: tokenValue,
            expiresAt: new Date(Date.now() + 3600 * 1000),
            isActive: true
        };

        await this.tokenRepository.saveToken(token);
        console.log(`✅ Token guardado en MongoDB para el usuario ${userId}`);

        const message = `Su código de verificación es: ${tokenValue}`;
        await this.whatsappAdapter.sendMessage(phone, message);
        console.log(`✔️ Mensaje de WhatsApp enviado a ${phone} con el token de verificación.`);
    }
}




/*import { TokenRepository } from "../../Token/domain/TokenRepository";
import { EmailAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { v4 as uuidv4 } from "uuid";

export class TokenService {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly emailAdapter: EmailAdapter,
    ) {}

    async sendVerificationToken(email: string, userId: string): Promise<void> {
        // Generar el token de verificación
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const token = {
            uuid: uuidv4(),               // ID único del token
            userUuid: userId,             // UUID del usuario
            email: email,                 // Correo del usuario
            token: tokenValue,            // Valor del token generado
            expiresAt: new Date(Date.now() + 3600 * 1000),  // Expira en 1 hora
            isActive: true                // Indica que el token está activo
        };

        // Guardar el token en MongoDB
        await this.tokenRepository.saveToken(token);
        console.log(`✅ Token guardado en MongoDB para el usuario ${userId}`);

        // Enviar el token por correo
        const message = `Su código de verificación es: ${tokenValue}`;
        await this.emailAdapter.sendEmail(email, "Código de Verificación", message);
        console.log(`✔️ Correo enviado a ${email} con el token de verificación.`);
    }
}*/







/*import { TokenRepository } from "../../Token/domain/TokenRepository";
import { EmailAdapter } from "../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter";
import { v4 as uuidv4 } from "uuid";

export class TokenService {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly emailAdapter: EmailAdapter,
    ) {}

    async sendVerificationToken(email: string, userId: string): Promise<void> {
        // Generar el token de verificación
        const tokenValue = Math.floor(1000 + Math.random() * 9000).toString();
        const token = {
            uuid: uuidv4(),               // ID único del token
            userUuid: userId,  
            email: email,           // UUID del usuario
            token: tokenValue,            // Valor del token generado
            expiresAt: new Date(Date.now() + 3600 * 1000)  // Expira en 1 hora
        };

        // Guardar el token en MongoDB
        await this.tokenRepository.saveToken(token);
        console.log(`✅ Token guardado en MongoDB para el usuario ${userId}`);

        // Enviar el token por correo
        const message = `Su código de verificación es: ${tokenValue}`;
        await this.emailAdapter.sendEmail(email, "Código de Verificación", message);
        console.log(`✔️ Correo enviado a ${email} con el token de verificación.`);
    }
}

*/


