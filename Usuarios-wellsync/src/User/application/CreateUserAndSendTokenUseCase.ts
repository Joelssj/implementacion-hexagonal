import { UsersRepository } from "../domain/UsersRepository";
import { LeadsRepository } from "../../Contacts/domain/LeadsRepository";
import { User } from "../domain/User";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import { RabbitMQPublisher } from "../infraestructure/rabbitmq/RabbitMQPublisher";

export class CreateUserUseCase {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly leadsRepository: LeadsRepository,
        private readonly rabbitMQPublisher: RabbitMQPublisher
    ) {}

    async run(
        correo: string, 
        password: string, 
        confirmPassword: string, 
        notificationPreference: 'email' | 'whatsapp' = 'email' // Valor predeterminado si no se proporciona
    ): Promise<User> {
        // 1. Verificar que las contraseñas coinciden
        if (password !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        // 2. Validar que la contraseña cumpla con los requisitos de seguridad
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error("La contraseña debe tener al menos 8 caracteres, incluir letras, números y símbolos especiales.");
        }

        // 3. Verificar que el lead existe
        const lead = await this.leadsRepository.getByEmail(correo);
        if (!lead) {
            throw new Error("Lead no encontrado.");
        }

        // 4. Verificar que el usuario no exista
        const existingUser = await this.usersRepository.getUserByEmail(correo);
        if (existingUser) {
            throw new Error("El correo ya está registrado.");
        }

        // 5. Encriptar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Crear el usuario asociado al lead con la preferencia de notificación
        const userUuid = uuidv4();
        const user = new User(userUuid, correo, hashedPassword, false, lead.uuid, notificationPreference);

        // 7. Guardar el usuario en la base de datos
        await this.usersRepository.saveUser(user);
        console.log("Usuario creado exitosamente.");

        // 8. Incluir el número de teléfono y la preferencia de notificación en el evento
        const event = { 
            userId: userUuid, 
            email: correo, 
            notificationPreference, 
            phone: lead.phone // Incluir el número de teléfono del lead
        };

        // 9. Publicar el evento de creación del usuario en RabbitMQ
        try {
            await this.rabbitMQPublisher.publish("user.created", event);
            console.log("Evento 'user.created' publicado en RabbitMQ con los datos:", event);
        } catch (error) {
            console.error("Error al publicar el evento de creación del usuario en RabbitMQ:", error);
            throw new Error("No se pudo procesar el evento de creación.");
        }

        // 10. Retornar el usuario creado
        return user;
    }
}





