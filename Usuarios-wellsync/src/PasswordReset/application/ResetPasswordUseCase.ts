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































