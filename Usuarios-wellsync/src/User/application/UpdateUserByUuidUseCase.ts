import { UsersRepository } from "../domain/UsersRepository";
import { User } from "../domain/User";
import bcrypt from 'bcrypt';

export class UpdateUserByUuidUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async run(
        uuid: string,
        correo: string,
        currentPassword: string,  // Contraseña actual proporcionada por el usuario
        password: string,
        confirmPassword: string,
        isActive: boolean | null = null,  // Opcional, por defecto nulo
        notificationPreference: 'email' | 'whatsapp' | null = null  // Opcional, por defecto nulo
    ): Promise<void> {
        // Obtener el usuario por UUID
        const user = await this.usersRepository.getUserByUuid(uuid);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        // Validar la contraseña actual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error("La contraseña actual no es correcta.");
        }

        // Validar que la nueva contraseña y la confirmación coincidan
        if (password !== confirmPassword) {
            throw new Error("Las nuevas contraseñas no coinciden.");
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Usar la preferencia de notificación y estado activo actuales si no se proporcionan valores nuevos
        const finalNotificationPreference = notificationPreference ?? user.notificationPreference;
        const finalIsActive = isActive ?? user.isActive;

        // Actualizar la información del usuario
        const updatedUser = new User(
            user.uuid,
            correo,
            hashedPassword,
            finalIsActive,
            user.leadUuid,
            finalNotificationPreference
        );

        await this.usersRepository.updateUser(updatedUser);
    }
}





