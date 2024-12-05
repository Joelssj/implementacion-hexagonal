import { UsersRepository } from "../domain/UsersRepository";


export class CreateUserEventUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute(userUuid: string): Promise<void> {
        await this.usersRepository.createUserEvent(userUuid);
    }
}
