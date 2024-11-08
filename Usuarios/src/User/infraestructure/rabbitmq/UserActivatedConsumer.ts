import { RabbitMQService } from "./RabbitMQService";
import { UsersRepository } from "../../domain/UsersRepository";

export class UserActivatedConsumer {
    constructor(
        private readonly userRepository: UsersRepository
    ) {}

    async start() {
        console.log("Iniciando el consumidor de UserActivatedConsumer...");
        const channel = await RabbitMQService.getChannel();
        const queue = "user.token.validated";

        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, async (msg) => {
            if (msg) {
                console.log("🔔 Mensaje recibido para activación de usuario:", msg.content.toString());
                const { userUuid } = JSON.parse(msg.content.toString());
        
                try {
                    await this.userRepository.activateUser(userUuid);
                    console.log(`✔️ Usuario ${userUuid} activado en PostgreSQL`);
                    channel.ack(msg); // Confirma el mensaje como procesado
                } catch (error) {
                    console.error(`❌ Error al activar el usuario ${userUuid}:`, error);
                }
            }
        }, { noAck: false });
        
        
    }
}
