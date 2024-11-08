// UsersRepository.ts
import { User } from "./User";

export interface UsersRepository {
    saveUser(user: User): Promise<void>;
    getUserByEmail(correo: string): Promise<User | null>;
    activateUser(userUuid: string): Promise<void>;
    getByUuid(uuid: string): Promise<User | null>;
    getUserByUuid(uuid: string): Promise<User | null>;
    deleteUserByUuid(uuid: string): Promise<void>;
    updateUser(user: User): Promise<void>;
    login(correo: string, password: string): Promise<User | null>;

    // Modificar `save` para que acepte solo `correo` y `password`
    save(userData: { correo: string; password: string }): Promise<User>;
}



/*// UsersRepository.ts
import { User } from "./User";

export interface UsersRepository {
    saveUser(user: User): Promise<void>;
    getUserByEmail(correo: string): Promise<User | null>;
    activateUser(userUuid: string): Promise<void>;
    getByUuid(uuid: string): Promise<User | null>;
    getUserByUuid(uuid: string): Promise<User | null>;
    deleteUserByUuid(uuid: string): Promise<void>;
    updateUser(user: User): Promise<void>;
    login(correo: string, password: string): Promise<User | null>;

    // Modificación del método save para incluir confirmPassword
    save(userData: { correo: string; password: string; confirmPassword: string }): Promise<User>;
}
*/



/*import { User } from "./User";

export interface UsersRepository {
    saveUser(user: User): Promise<void>;
    getUserByEmail(correo: string): Promise<User | null>;
    activateUser(userUuid: string): Promise<void>;
    getByUuid(uuid: string): Promise<User | null>;
    getUserByUuid(uuid: string): Promise<User | null>;
    deleteUserByUuid(uuid: string): Promise<void>; 
    updateUser(user: User): Promise<void>;
    login(correo: string, password: string): Promise<User | null>;
    save(userData: { correo: string; password: string }): Promise<User>; 

}*/
