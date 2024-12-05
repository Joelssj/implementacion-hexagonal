import { UsersRepository } from "../domain/UsersRepository";

export class DeleteUserByUuidUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async run(uuid: string): Promise<void> {
        const user = await this.usersRepository.getUserByUuid(uuid);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        await this.usersRepository.deleteUserByUuid(uuid);
    }
}
