// src/Notifications/application/LeadCreatedConsumer.ts
import { RabbitMQService } from './RabbitMQService';
import { EmailAdapter } from '../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter';
import { TwilioAdapter } from '../../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter';

export class LeadCreatedConsumer {
  private emailAdapter: EmailAdapter;
  private twilioAdapter: TwilioAdapter;
  private static leadCache: Map<string, { phone: string; correo: string }> = new Map();

  constructor() {
    this.emailAdapter = new EmailAdapter();
    this.twilioAdapter = new TwilioAdapter();
  }

  async consume() {
    const channel = await RabbitMQService.getChannel();
    const queue = 'lead.created';
    
    await channel.assertQueue(queue, { durable: true });
    console.log(`✔️ Escuchando eventos en la cola ${queue}`);

    channel.consume(queue, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log("📥 Evento recibido en Notifications (lead.created):", event);

        const { leadUuid, correo, firstName, lastName, phone, notification_preference } = event;

        // Guardar lead en el cache para uso posterior en user.created
        LeadCreatedConsumer.leadCache.set(leadUuid, { phone, correo });
        console.log(`🔍 Datos del lead almacenados temporalmente en cache para UUID ${leadUuid}:`, { phone, correo });

        const subject = "Bienvenido a nuestra plataforma";
        const message = `Hola ${firstName} ${lastName},\n\nGracias por unirte a nuestra plataforma. ¡Esperamos que tengas una gran experiencia!`;

        try {
          if (notification_preference === 'email') {
            await this.emailAdapter.sendEmail(correo, subject, message);
            console.log(`✔️ Correo de bienvenida enviado a ${correo}`);
          } else if (notification_preference === 'whatsapp') {
            await this.twilioAdapter.sendMessage(phone, message);
            console.log(`✔️ Mensaje de bienvenida enviado a ${phone} por WhatsApp`);
          } else {
            console.error(`❌ Preferencia de notificación desconocida para el lead con UUID: ${leadUuid}`);
          }
        } catch (error) {
          console.error(`❌ Error al enviar la notificación al lead con UUID: ${leadUuid}:`, error);
        }

        channel.ack(msg);
      }
    });
  }

  // Método estático para obtener el teléfono de un lead desde el cache
  static getLeadData(leadUuid: string) {
    return this.leadCache.get(leadUuid);
  }
}


