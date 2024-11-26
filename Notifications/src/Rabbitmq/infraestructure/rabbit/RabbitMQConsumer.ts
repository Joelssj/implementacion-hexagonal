// src/Notifications/application/RabbitMQConsumer.ts

import { RabbitMQService } from './RabbitMQService';
import { TokenService } from '../../domain/TokenService';
import { EmailAdapter } from '../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter';
import { MongoTokenRepository } from '../../../Token/infrestructure/adapters/MongoTokenRepository';
import { TwilioAdapter } from '../../../Notifications/WhatsApp/infraestructure/adapters/TwilioAdapter';

export class RabbitMQConsumer {
  private tokenService: TokenService;

  constructor() {
    const emailAdapter = new EmailAdapter();
    const whatsappAdapter = new TwilioAdapter();
    const tokenRepository = new MongoTokenRepository();
    this.tokenService = new TokenService(tokenRepository, emailAdapter, whatsappAdapter);
  }

  // Consumidor para eventos de user.created
  async consumeUserCreatedEvent() {
    const channel = await RabbitMQService.getChannel();
    const queue = 'user.created'; 

    await channel.assertQueue(queue, { durable: true });
    console.log(`✔️ Escuchando eventos en la cola ${queue} para usuarios`);

    channel.consume(queue, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log("📥 Evento recibido en Notifications (user.created):", event);

        try {
          if (event.notificationPreference === 'email') {
            await this.tokenService.sendVerificationToken(event.email, event.userId);
            console.log(`✔️ Token enviado por correo a ${event.email}`);
          } else if (event.notificationPreference === 'whatsapp') {
            if (!event.phone) {
              throw new Error("Número de teléfono no proporcionado en el evento");
            }
            await this.tokenService.sendTokenViaWhatsApp(event.phone, event.userId);
            console.log(`✔️ Token enviado por WhatsApp al número ${event.phone}`);
          } else {
            console.log(`❌ Preferencia de notificación desconocida para el usuario con UUID: ${event.userId}`);
          }
        } catch (error) {
          console.error(`❌ Error al procesar el token para ${event.email || "sin email"}:`, error);
        }

        channel.ack(msg); // Confirmar el mensaje como procesado
      }
    });
  }

  // Inicializar los consumidores de eventos
  async initializeConsumers() {
    await this.consumeUserCreatedEvent(); // Escuchar eventos user.created
  }
}




/*// src/Notifications/application/RabbitMQConsumer.ts
import { RabbitMQService } from './RabbitMQService';
import { TokenService } from '../../domain/TokenService';
import { EmailAdapter } from '../../../Notifications/WhatsApp/infraestructure/adapters/EmailAdapter';
import { MongoTokenRepository } from '../../../Token/infrestructure/adapters/MongoTokenRepository';


export class RabbitMQConsumer {
  private tokenService: TokenService;

  constructor() {
    const emailAdapter = new EmailAdapter();
    const tokenRepository = new MongoTokenRepository();
    this.tokenService = new TokenService(tokenRepository, emailAdapter); // Inicializa el servicio de token
  }

  async consumeUserCreatedEvent() {
    const channel = await RabbitMQService.getChannel();
    const queue = 'user.created';
    
    await channel.assertQueue(queue, { durable: true });
    console.log(`✔️ Escuchando eventos en la cola ${queue}`);

    channel.consume(queue, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log("📥 Evento recibido en Notifications (user.created):", event);

        try {
          // Usa el servicio para generar, guardar y enviar el token
          await this.tokenService.sendVerificationToken(event.email, event.userId);
          console.log(`✔️ Token generado, guardado y enviado a ${event.email}`);
        } catch (error) {
          console.error(`❌ Error al procesar el token para ${event.email}:`, error);
        }

        channel.ack(msg); // Confirmar el mensaje como procesado
      }
    });
  }
}


*/