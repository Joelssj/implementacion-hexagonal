import { User } from "../domain/User";
import { UsersRepository } from "../domain/UsersRepository";

export class LoginUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async run(correo: string, password: string): Promise<{ userUuid: string; leadUuid: string } | null> {
        try {
            const user = await this.usersRepository.login(correo, password);
            if (user) {
                return { userUuid: user.uuid, leadUuid: user.leadUuid || '' }; // Devolver ambos UUIDs
            }
            return null;
        } catch (error) {
            console.error("Error en el proceso de login:", error);
            return null;
        }
    }
}



/*import { User } from "../domain/User";
import { UsersRepository } from "../domain/UsersRepository";

export class LoginUseCase{
    constructor(readonly usersReposotory: UsersRepository){}

    async run(
        nombre:string,
        correo:string,
        password:string
    ): Promise<User | null> {
     try {
        const result = await this.usersReposotory.login(
            correo,
            password
        );
        return result;
     } catch (error) {
        return null;
     }
    }
}*/