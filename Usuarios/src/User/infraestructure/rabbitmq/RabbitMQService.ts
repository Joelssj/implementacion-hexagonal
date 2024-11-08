// RabbitMQService.ts
import amqp from 'amqplib';

export class RabbitMQService {
  private static connection: amqp.Connection;
  private static channel: amqp.Channel;

  static async getChannel(): Promise<amqp.Channel> {
    try {
      if (!this.connection) {
        console.log("Conectando a RabbitMQ...");  // Mensaje antes de la conexión
        this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@44.209.18.55');
        console.log("Conexión exitosa a RabbitMQ");  // Mensaje después de la conexión exitosa

        this.channel = await this.connection.createChannel();
        console.log("Canal de RabbitMQ creado correctamente");  // Mensaje después de crear el canal
      }
      return this.channel;
    } catch (error) {
      console.error("Error al conectar a RabbitMQ:", error);  // Mensaje en caso de error
      throw error;
    }
  }

  static async publishToQueue(queueName: string, message: string) {
    try {
      const channel = await this.getChannel();
      await channel.assertQueue(queueName, { durable: true });
      channel.sendToQueue(queueName, Buffer.from(message));
      console.log(`Mensaje enviado a la cola '${queueName}': ${message}`);  // Confirmación de envío de mensaje
    } catch (error) {
      console.error("Error al enviar mensaje a RabbitMQ:", error);  // Mensaje en caso de error al enviar
    }
  }
}
