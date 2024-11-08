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
        // Verificar que las contraseñas coinciden
        if (password !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        // Verificar que el lead existe
        const lead = await this.leadsRepository.getByEmail(correo);
        if (!lead) {
            throw new Error("Lead no encontrado.");
        }

        // Encriptar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario asociado al lead con la preferencia de notificación
        const userUuid = uuidv4();
        const user = new User(userUuid, correo, hashedPassword, false, lead.uuid, notificationPreference);
        await this.usersRepository.saveUser(user);

        console.log("Usuario creado exitosamente.");

        // Incluir el número de teléfono en el evento
        const event = { 
            userId: userUuid, 
            email: correo, 
            notificationPreference, 
            phone: lead.phone // Incluir el número de teléfono del lead
        };

        await this.rabbitMQPublisher.publish("user.created", event);
        console.log("Evento 'user.created' publicado en RabbitMQ con los datos:", event);

        // Retornar el usuario creado
        return user;
    }
}


/*import { UsersRepository } from "../domain/UsersRepository";
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
        notificationPreference: 'email' | 'whatsapp'
    ): Promise<User> {
        // Verificar que las contraseñas coinciden
        if (password !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        // Verificar que el lead existe
        const lead = await this.leadsRepository.getByEmail(correo);
        if (!lead) {
            throw new Error("Lead no encontrado.");
        }

        // Validar que la preferencia de notificación sea válida
        if (!['email', 'whatsapp'].includes(notificationPreference)) {
            throw new Error("La preferencia de notificación debe ser 'email' o 'whatsapp'.");
        }

        // Encriptar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario asociado al lead con la preferencia de notificación
        const userUuid = uuidv4();
        const user = new User(userUuid, correo, hashedPassword, false, lead.uuid, notificationPreference);
        await this.usersRepository.saveUser(user);

        console.log("Usuario creado exitosamente.");

        // Incluir el número de teléfono en el evento
        const event = { 
            userId: userUuid, 
            email: correo, 
            notificationPreference, 
            phone: lead.phone // Incluir el número de teléfono del lead
        };

        await this.rabbitMQPublisher.publish("user.created", event);
        console.log("Evento 'user.created' publicado en RabbitMQ con los datos:", event);

        // Retornar el usuario creado
        return user;
    }
}
*/









/*
// CreateUserUseCase.ts
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

    async run(correo: string, password: string, confirmPassword: string): Promise<User> {
        // Verificar que las contraseñas coinciden
        if (password !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        // Verificar que el lead existe
        const lead = await this.leadsRepository.getByEmail(correo);
        if (!lead) {
            throw new Error("Lead no encontrado.");
        }

        // Encriptar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario asociado al lead
        const userUuid = uuidv4();
        const user = new User(userUuid, correo, hashedPassword, false, lead.uuid);
        await this.usersRepository.saveUser(user);

        console.log("Usuario creado exitosamente.");

        // Publicar el evento en RabbitMQ
        const event = { userId: userUuid, email: correo };
        await this.rabbitMQPublisher.publish("user.created", event);
        console.log("Evento 'user.created' publicado en RabbitMQ:", event);

        // Retornar el usuario creado
        return user;
    }
}



*/












