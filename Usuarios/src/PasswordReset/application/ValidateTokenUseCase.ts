// ValidateTokenUseCase.ts
import { PasswordResetRepository } from "../domain/PasswordResetRepository";
import { UsersRepository } from "../../User/domain/UsersRepository";

export class ValidateTokenUseCase {
    constructor(
        private readonly passwordResetRepository: PasswordResetRepository,
        private readonly usersRepository: UsersRepository
    ) {}

    async run(token: string): Promise<string> {
        const passwordReset = await this.passwordResetRepository.getPasswordResetByToken(token);
        if (!passwordReset) {
            throw new Error("Token inválido o expirado.");
        }

        const user = await this.usersRepository.getUserByEmail(passwordReset.correo);
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        // Retornar el identificador único del usuario
        return user.uuid;
    }
}
