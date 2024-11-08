import { UsersRepository } from "../domain/UsersRepository";
import { User } from "../domain/User";

export class GetUserByUuidUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async run(uuid: string): Promise<User | null> {
        const user = await this.usersRepository.getUserByUuid(uuid);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    }
}
