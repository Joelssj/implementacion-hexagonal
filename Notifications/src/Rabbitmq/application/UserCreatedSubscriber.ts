// src/Notifications/application/UserCreatedSubscriber.ts
import { RabbitMQService } from '../infraestructure/rabbit/RabbitMQService';
import { TokenService } from '../domain/TokenService';


export class UserCreatedSubscriber {
  private queue = 'user_created';

  constructor(private tokenService: TokenService) {}

  async subscribe() {
    const channel = await RabbitMQService.getChannel();
    await channel.assertQueue(this.queue, { durable: true });

    console.log(`Escuchando mensajes en la cola: ${this.queue}`);

    channel.consume(this.queue, async (message) => {
      if (message) {
        const content = JSON.parse(message.content.toString());
        const { email, userId } = content;

        console.log(`Mensaje recibido: Usuario creado - Email: ${email}, UserID: ${userId}`);

        // Genera y envía el token al usuario a través de la API de Notifications
        await this.tokenService.sendVerificationToken(email, userId);

        // Confirma el mensaje para RabbitMQ
        channel.ack(message);
      }
    });
  }
}
