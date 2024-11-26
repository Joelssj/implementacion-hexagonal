// ResetPasswordUseCase.ts
import bcrypt from "bcrypt";
import { PasswordResetRepository } from "../domain/PasswordResetRepository";
import { UsersRepository } from "../../User/domain/UsersRepository";

export class ResetPasswordUseCase {
    constructor(
        private readonly passwordResetRepository: PasswordResetRepository,
        private readonly usersRepository: UsersRepository
    ) {}

    async run(UserUuid: string, newPassword: string, confirmPassword: string): Promise<void> {
        if (newPassword !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        const user = await this.usersRepository.getUserByUuid(UserUuid);
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.updateUser(user);

    }
}





































/*import bcrypt from "bcrypt"; // Importar bcrypt para el hashing de contraseñas
import { PasswordResetRepository } from "../domain/PasswordResetRepository";
import { UsersRepository } from "../../User/domain/UsersRepository";

export class ResetPasswordUseCase {
    constructor(
        private readonly passwordResetRepository: PasswordResetRepository,
        private readonly usersRepository: UsersRepository
    ) {}

    // Paso 1: Validar el token y obtener el UserUuid asociado
    async validateToken(token: string): Promise<string> {
        const passwordReset = await this.passwordResetRepository.getPasswordResetByToken(token);
        if (!passwordReset) {
            throw new Error("Token inválido o expirado.");
        }

        const user = await this.usersRepository.getUserByEmail(passwordReset.correo);
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Retornar el identificador único del usuario (ajusta según el nombre del campo)
        return user.uuid; // Cambia `id` si el campo tiene un nombre diferente en tu entidad `User`
    }

// Paso 2: Cambiar la contraseña usando el UserUuid y el token
async resetPassword(UserUuid: string, token: string, newPassword: string, confirmPassword: string): Promise<void> {
    // Verificar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden.");
    }

    // Buscar al usuario por UserUuid
    const user = await this.usersRepository.getUserByUuid(UserUuid);
    if (!user) {
        throw new Error("Usuario no encontrado.");
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario
    user.password = hashedPassword;
    await this.usersRepository.updateUser(user);

    // Eliminar el registro de reseteo de contraseña usando el token
    await this.passwordResetRepository.deletePasswordReset(token);
}

}*/




/*import { PasswordResetRepository } from "../domain/PasswordResetRepository";
import { UsersRepository } from "../../User/domain/UsersRepository";
import bcrypt from "bcrypt";

export class ResetPasswordUseCase {
    constructor(
        private readonly passwordResetRepository: PasswordResetRepository,
        private readonly usersRepository: UsersRepository
    ) {}

    async run(token: string, newPassword: string, confirmPassword: string): Promise<void> {
        // Verificar si las contraseñas coinciden
        if (newPassword !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        // Buscar el token en la base de datos
        const passwordReset = await this.passwordResetRepository.getPasswordResetByToken(token);
        if (!passwordReset) {
            throw new Error("Token inválido o expirado.");
        }

        // Obtener el correo desde el resultado del token
        const { correo } = passwordReset;

        // Buscar el usuario con el correo en la tabla users
        const user = await this.usersRepository.getUserByEmail(correo);
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario
        user.password = hashedPassword;
        await this.usersRepository.updateUser(user);

        // Eliminar el registro de reseteo de contraseña
        await this.passwordResetRepository.deletePasswordReset(token);
    }
}
*/
