// src/Notifications/infrastructure/rabbitmq/RabbitMQPublisher.ts
import { RabbitMQService } from './RabbitMQService';

export class RabbitMQPublisher {
  async publish(queue: string, message: object) {
    const channel = await RabbitMQService.getChannel(); // Obtén el canal desde RabbitMQService

    // Asegúrate de crear la cola si no existe
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`📤 Mensaje publicado en RabbitMQ en la cola ${queue}: ${JSON.stringify(message)}`);
  }
}


