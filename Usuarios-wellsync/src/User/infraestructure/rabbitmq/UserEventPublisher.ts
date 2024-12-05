import { RabbitMQPublisher } from './RabbitMQPublisher';

export class UserEventPublisher {
  private publisher: RabbitMQPublisher;

  constructor() {
    this.publisher = new RabbitMQPublisher();
  }

  async publishUserEvent(userUuid: string, email: string) {
    const message = {
      userUuid,
      email,
    };

    // Publica el mensaje en la cola `user_events`
    await this.publisher.publish('user_events', message);
    console.log("📤 Evento de usuario publicado:", message);
  }
}
