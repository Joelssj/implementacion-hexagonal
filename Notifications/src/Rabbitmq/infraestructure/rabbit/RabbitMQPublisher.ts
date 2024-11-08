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




/*import amqp from 'amqplib';

export class RabbitMQPublisher {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  private async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@44.209.18.55');
      this.channel = await this.connection.createChannel();
    }
  }

  async publish(exchange: string, message: object) {
    if (!this.channel) await this.connect(); // Asegúrate de que `connect` se llama si `channel` es `null`

    if (this.channel) {
      await this.channel.assertExchange(exchange, 'fanout', { durable: true });
      this.channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));
      console.log(`Mensaje publicado en RabbitMQ: ${JSON.stringify(message)}`);
    } else {
      console.error("No se pudo establecer la conexión con RabbitMQ");
    }
  }
}
*/