import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config(); 

export class TwilioAdapter {
    private client: twilio.Twilio;
    private from: string;

    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        const authToken = process.env.TWILIO_AUTH_TOKEN || '';
        this.from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM || ''}`;

        if (!accountSid || !authToken || !this.from) {
            throw new Error('Error: Faltan las credenciales de Twilio en el archivo .env');
        }

        this.client = twilio(accountSid, authToken);
    }

    async sendMessage(to: string, message: string): Promise<void> {
        try {
            const cleanNumber = to.replace(/[^\d]/g, '');

            let formattedNumber = cleanNumber;
            if (!cleanNumber.startsWith('521')) { 
                formattedNumber = `521${cleanNumber}`; 
            }

            const whatsappTo = `whatsapp:+${formattedNumber}`;

            const response = await this.client.messages.create({
                from: this.from,    
                to: whatsappTo,    
                body: message       
            });

            console.log(`Mensaje enviado correctamente con SID: ${response.sid}`);
            console.log(`Estado del mensaje: ${response.status}`);
        } catch (error) {
            console.error('Error al enviar el mensaje de Twilio:', error);
            throw new Error('No se pudo enviar el mensaje de verificación.');
        }
    }
}


