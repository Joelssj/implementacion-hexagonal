// TokenRepository.ts
import { Token } from "./Token";

export interface TokenRepository {
    saveToken(token: Token): Promise<void>; // Guardar un objeto Token completo
    getTokenByUserUuid(userUuid: string): Promise<Token | null>; // Obtener un token activo por UserUUID

    // Cambiar el método `deleteToken` a `deactivateToken`
    deactivateToken(tokenValue: string): Promise<void>; // Marcar un token como inactivo

    getUserEmailByUuid(userUuid: string): Promise<string | null>; // Obtener el correo del usuario por su UUID


    
}








/*import { Token } from "./Token";

export interface TokenRepository {
    saveToken(token: Token): Promise<void>; // Guardar un objeto Token completo
    getTokenByUserUuid(userUuid: string): Promise<Token | null>; // Obtener un token por UserUUID
    deleteToken(tokenValue: string): Promise<void>; // Eliminar un token por su valor
    getUserEmailByUuid(userUuid: string): Promise<string | null>;

}*/


