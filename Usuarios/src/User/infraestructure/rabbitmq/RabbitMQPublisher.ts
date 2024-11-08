import { RabbitMQService } from './RabbitMQService';

export class RabbitMQPublisher {
  async publish(queue: string, message: any) {
    const channel = await RabbitMQService.getChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`📤 Mensaje enviado a la cola ${queue}:`, message);
  }
}
