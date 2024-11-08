// src/Users/application/PublishUserCreatedEventUseCase.ts
import { UsersRepository } from '../domain/UsersRepository';
import { RabbitMQPublisher } from '../infraestructure/rabbitmq/RabbitMQPublisher';
import { UserCreatedEvent } from '../domain/events/UserCreatedEvent';
import { LeadsRepository } from '../../Contacts/domain/LeadsRepository';

export class PublishUserCreatedEventUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly publisher: RabbitMQPublisher,
    private readonly leadsRepository: LeadsRepository
  ) {}

  async execute(userData: { correo: string; password: string; leadUuid: string }) {
    // Guardar el usuario en el repositorio
    const user = await this.userRepository.save(userData);

    // Extraer el número de teléfono del lead utilizando el leadUuid
    const leadData = await this.leadsRepository.getLeadByUuid(userData.leadUuid);

    if (!leadData || !leadData.phone) {
      throw new Error('Número de teléfono no encontrado para el lead');
    }

    // Crear el evento incluyendo el número de teléfono
    const event = new UserCreatedEvent(user.uuid, user.correo, userData.leadUuid, leadData.phone);

    // Publicar el evento
    console.log(`📤 Publicando evento user.created con los siguientes datos:`);
    console.log(`- UUID de usuario: ${user.uuid}`);
    console.log(`- Correo: ${user.correo}`);
    console.log(`- UUID de lead: ${userData.leadUuid}`);
    console.log(`- Teléfono: ${leadData.phone}`);  // Asegúrate de ver el número de teléfono aquí

    await this.publisher.publish('user.created', event);
    console.log(`Evento user.created publicado en RabbitMQ con datos: ${JSON.stringify(event)}`);

    return user;
  }
}







/*// src/Users/application/PublishUserCreatedEventUseCase.ts
import { UsersRepository } from '../domain/UsersRepository';
import { RabbitMQPublisher } from '../infraestructure/rabbitmq/RabbitMQPublisher';
import { UserCreatedEvent } from '../domain/events/UserCreatedEvent';

export class PublishUserCreatedEventUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly publisher: RabbitMQPublisher
  ) {}

  async execute(userData: { correo: string; password: string }) {
    // Crear y guardar el usuario en el repositorio
    const user = await this.userRepository.save(userData);
    
    // Crear el evento con los datos necesarios
    const event = new UserCreatedEvent(user.uuid, user.correo);

    // Publicar el evento en RabbitMQ
    await this.publisher.publish('user.created', event); // Usamos la cola `user.created`
    console.log(`Evento user.created publicado en RabbitMQ con datos: ${JSON.stringify(event)}`);
    console.log('Usuario creado y evento enviado a RabbitMQ:', userData.correo);

    return user;
  }
}
*/



/*import { UsersRepository } from '../domain/UsersRepository';
import { RabbitMQPublisher } from '../infraestructure/rabbitmq/RabbitMQPublisher';
import { UserCreatedEvent } from '../domain/events/UserCreatedEvent';

export class PublishUserCreatedEventUseCase {
  constructor(
    private userRepository: UsersRepository,
    private publisher: RabbitMQPublisher
  ) {}

  async run(userData: { correo: string; password: string }) { // Usar 'correo'
    const user = await this.userRepository.save(userData);
    const event = new UserCreatedEvent(user.uuid, user.correo); // Usar 'correo'
    await this.publisher.publishUserCreatedEvent(event);
    return user;
  }
}
*/

