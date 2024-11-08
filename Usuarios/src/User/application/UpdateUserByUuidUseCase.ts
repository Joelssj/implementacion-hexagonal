import { UsersRepository } from "../domain/UsersRepository";
import { User } from "../domain/User";
import bcrypt from 'bcrypt';

export class UpdateUserByUuidUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async run(
        uuid: string,
        correo: string,
        password: string,
        confirmPassword: string,
        isActive: boolean | null,
        notificationPreference: 'email' | 'whatsapp' | null
    ): Promise<void> {
        const user = await this.usersRepository.getUserByUuid(uuid);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        // Validar que la contraseña y la confirmación coincidan
        if (password !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Usar la preferencia actual si no se proporciona una nueva
        const finalNotificationPreference = notificationPreference ?? user.notificationPreference;

        // Validar que la preferencia de notificación sea válida si se proporciona una
        if (finalNotificationPreference && !['email', 'whatsapp'].includes(finalNotificationPreference)) {
            throw new Error("La preferencia de notificación debe ser 'email' o 'whatsapp'.");
        }

        // Actualizar la información del usuario, incluyendo la preferencia de notificación
        const updatedUser = new User(
            user.uuid,
            correo,
            hashedPassword,
            isActive ?? user.isActive, // Mantener `isActive` actual si no se proporciona
            user.leadUuid,
            finalNotificationPreference
        );
        await this.usersRepository.updateUser(updatedUser);
    }
}


