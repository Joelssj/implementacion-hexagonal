// MongoTokenRepository.ts
import { TokenRepository } from "../../domain/TokenRepository";
import { Token } from "../../domain/Token";
import { getMongoDB } from "../../../database/mongodb";

export class MongoTokenRepository implements TokenRepository {
    private collection = getMongoDB().collection('tokens');
    private usersCollection = getMongoDB().collection('users'); // Colección de usuarios

    // Guardar token en la base de datos
    async saveToken(token: Token): Promise<void> {
        try {
            await this.collection.insertOne(token);
            console.log(`✅ Token guardado en MongoDB para el usuario con UUID: ${token.userUuid}`);
        } catch (error) {
            console.error(`⚠️ Error al guardar el token para el usuario ${token.userUuid}: ${error}`);
            throw new Error("No se pudo guardar el token en la base de datos.");
        }
    }

    // Obtener token activo por UUID del usuario
    async getTokenByUserUuid(userUuid: string): Promise<Token | null> {
        console.log(`🔍 Buscando token activo para el usuario con UUID: ${userUuid}`);
        
        try {
            const tokenData = await this.collection.findOne({ userUuid, isActive: true });
            if (!tokenData) {
                console.log(`⚠️ No se encontró token activo para el usuario con UUID: ${userUuid}`);
                return null;
            }
    
            console.log(`🔍 Token encontrado para el usuario con UUID: ${userUuid} - Token: ${tokenData.token}`);
            return new Token(tokenData.uuid, tokenData.userUuid, tokenData.token, tokenData.expiresAt);
        } catch (error) {
            console.error(`⚠️ Error al buscar el token para el usuario ${userUuid}: ${error}`);
            throw new Error("No se pudo obtener el token para el usuario.");
        }
    }

    // Desactivar un token
    async deactivateToken(tokenValue: string): Promise<void> {
        try {
            await this.collection.updateOne(
                { token: tokenValue },
                { $set: { isActive: false } }
            );
            console.log(`🚫 Token ${tokenValue} marcado como inactivo en MongoDB`);
        } catch (error) {
            console.error(`⚠️ Error al desactivar el token ${tokenValue}: ${error}`);
            throw new Error("No se pudo desactivar el token.");
        }
    }

    // Obtener el correo de un usuario por su UUID
    async getUserEmailByUuid(userUuid: string): Promise<string | null> {
        const userTokenData = await this.collection.findOne({ userUuid });
        if (userTokenData && userTokenData.email) {
            return userTokenData.email;
        } else {
            console.log(`⚠️ No se encontró el correo para el usuario con UUID: ${userUuid}`);
            return null;
        }
    }

    // Obtener el teléfono de un usuario por su UUID
    async getUserPhoneByUuid(userUuid: string): Promise<string | null> {
        const user = await this.collection.findOne({ userUuid });
        if (user && user.phone) {
            return user.phone;
        } else {
            console.log(`⚠️ No se encontró el teléfono para el usuario con UUID: ${userUuid}`);
            return null;
        }
    }
    
    
    

    // Obtener un token activo por teléfono
    async getTokenByPhone(phone: string): Promise<Token | null> {
        console.log(`🔍 Buscando token activo para el teléfono: ${phone}`);
        
        try {
            const user = await this.usersCollection.findOne({ phone });
            if (!user) {
                console.log(`⚠️ No se encontró usuario con el teléfono: ${phone}`);
                return null;
            }
    
            const tokenData = await this.collection.findOne({ userUuid: user.uuid, isActive: true });
            if (!tokenData) {
                console.log(`⚠️ No se encontró token activo para el usuario con teléfono: ${phone}`);
                return null;
            }
    
            console.log(`🔍 Token encontrado para el teléfono ${phone} - Token: ${tokenData.token}`);
            return new Token(tokenData.uuid, tokenData.userUuid, tokenData.token, tokenData.expiresAt);
        } catch (error) {
            console.error(`⚠️ Error al buscar el token para el teléfono ${phone}: ${error}`);
            throw new Error("No se pudo obtener el token para el teléfono.");
        }
    }
}

