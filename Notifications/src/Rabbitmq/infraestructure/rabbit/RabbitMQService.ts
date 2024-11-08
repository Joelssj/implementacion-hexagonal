import amqp from 'amqplib';

export class RabbitMQService {
  private static connection: amqp.Connection | null = null;
  private static channel: amqp.Channel | null = null;

  static async getChannel(): Promise<amqp.Channel> {
    // Configura la conexión solo si no está ya establecida
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@44.209.18.55');
      this.channel = await this.connection.createChannel();
    }
    
    // Si `channel` sigue siendo `null`, lanza un error
    if (!this.channel) {
      throw new Error("No se pudo crear el canal de RabbitMQ");
    }

    return this.channel;
  }
}


/*
// src/Notifications/infrastructure/rabbitmq/RabbitMQService.ts
import amqp from 'amqplib';

export class RabbitMQService {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;

  static async getChannel(): Promise<amqp.Channel> {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@44.209.18.55');
      this.channel = await this.connection.createChannel();
    }
    return this.channel;
  }
}
*/