// MongoTokenRepository.ts
import { TokenRepository } from "../../domain/TokenRepository";
import { Token } from "../../domain/Token";
import { getMongoDB } from "../../../database/mongodb";

export class MongoTokenRepository implements TokenRepository {
    private collection = getMongoDB().collection('tokens');

    async saveToken(token: Token): Promise<void> {
        await this.collection.insertOne(token);
        console.log(`✅ Token guardado en MongoDB para el usuario con UUID: ${token.userUuid}`);
    }

    async getTokenByUserUuid(userUuid: string): Promise<Token | null> {
        console.log(`🔍 Buscando token activo para el usuario con UUID: ${userUuid}`);
        
        // Buscar el token activo asociado al UUID del usuario
        const tokenData = await this.collection.findOne({ userUuid, isActive: true });
        
        if (!tokenData) {
            console.log(`⚠️ No se encontró token activo para el usuario con UUID: ${userUuid}`);
            return null;
        }
    
        console.log(`🔍 Token encontrado para el usuario con UUID: ${userUuid} - Token: ${tokenData.token}`);
        return new Token(tokenData.uuid, tokenData.userUuid, tokenData.token, tokenData.expiresAt);
    }
    
    async deactivateToken(tokenValue: string): Promise<void> {
        await this.collection.updateOne(
            { token: tokenValue },
            { $set: { isActive: false } }
        );
        console.log(`🚫 Token ${tokenValue} marcado como inactivo en MongoDB`);
    }

    async getUserEmailByUuid(userUuid: string): Promise<string | null> {
        const userTokenData = await this.collection.findOne({ userUuid });
        if (userTokenData && userTokenData.email) {
            return userTokenData.email;
        } else {
            console.log(`⚠️ No se encontró el correo para el usuario con UUID: ${userUuid}`);
            return null;
        }
    }
}

