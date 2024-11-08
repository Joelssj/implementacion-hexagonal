import { ProfilePicture } from "../../domain/ProfilePicture";
import { ProfilePictureRepository } from "../../domain/ProfilePictureRepository";
import { query } from "../../../database/pg/pg"; // Usamos la misma conexión de pg
import { v4 as uuidv4 } from 'uuid';

export class PgProfilePictureRepository implements ProfilePictureRepository {
    async save(profilePicture: ProfilePicture): Promise<void> {
        // Primero verificamos si ya existe una imagen para el usuario
        const existingProfilePicture = await this.getByUserUuid(profilePicture.userUuid);

        if (existingProfilePicture) {
            // Si ya existe, actualizamos la URL y la fecha de creación
            const sql = `
                UPDATE profile_pictures
                SET url = $1, created_at = $2
                WHERE user_uuid = $3
            `;
            const params = [profilePicture.url, new Date(), profilePicture.userUuid];
            await query(sql, params);
        } else {
            // Si no existe, insertamos una nueva imagen
            const sql = `
                INSERT INTO profile_pictures (id, user_uuid, url, created_at)
                VALUES ($1, $2, $3, $4)
            `;
            const params = [
                profilePicture.id || uuidv4(),
                profilePicture.userUuid,
                profilePicture.url,
                profilePicture.createdAt || new Date()
            ];
            await query(sql, params);
        }
    }

    async getByUserUuid(userUuid: string): Promise<ProfilePicture | null> {
        const sql = `
            SELECT * FROM profile_pictures WHERE user_uuid = $1 LIMIT 1
        `;
        const params = [userUuid];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const row = result.rows[0];
        return new ProfilePicture(row.id, row.user_uuid, row.url, row.created_at);
    }

    async delete(profilePictureId: string): Promise<void> {
        const sql = `
            DELETE FROM profile_pictures WHERE id = $1
        `;
        const params = [profilePictureId];
        await query(sql, params);
    }

    async getByUuid(uuid: string): Promise<string | null> {
        const sql = `SELECT url FROM profile_pictures WHERE id = $1 LIMIT 1`; // Seleccionamos solo el campo url
        const params = [uuid];
        const result = await query(sql, params);
    
        if (!result || !result.rows || result.rows.length === 0) return null;
    
        const row = result.rows[0];
        return row.url; // Retornamos solo la URL en lugar de un objeto completo
    }
}




/*import { ProfilePicture } from "../../domain/ProfilePicture";
import { ProfilePictureRepository } from "../../domain/ProfilePictureRepository";
import { query } from "../../../database/pg/pg"; // Usamos la misma conexión de pg
import { v4 as uuidv4 } from 'uuid';

export class PgProfilePictureRepository implements ProfilePictureRepository {
    async save(profilePicture: ProfilePicture): Promise<void> {
        const sql = `
        INSERT INTO profile_pictures (id, user_uuid, url, created_at)
        VALUES ($1, $2, $3, $4)
    `;
    const params = [
        profilePicture.id || uuidv4(),
        profilePicture.userUuid,  // Asegúrate de que esto contenga el UUID del usuario
        profilePicture.url,
        profilePicture.createdAt || new Date()
    ];
    await query(sql, params);
    }

    async getByUserUuid(userUuid: string): Promise<ProfilePicture | null> {
        const sql = `
            SELECT * FROM profile_pictures WHERE user_uuid = $1 LIMIT 1
        `;
        const params = [userUuid];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const row = result.rows[0];
        return new ProfilePicture(row.id, row.user_uuid, row.url, row.created_at); // Cambié `uuid` por `id`
    }

    async delete(profilePictureId: string): Promise<void> {
        const sql = `
            DELETE FROM profile_pictures WHERE id = $1
        `;
        const params = [profilePictureId];
        await query(sql, params);
    }

    async getByUuid(uuid: string): Promise<ProfilePicture | null> {
        const sql = `SELECT url FROM profile_pictures WHERE id = $1 LIMIT 1`; // Seleccionamos solo el campo url
        const params = [uuid];
        const result = await query(sql, params);
    
        if (!result || !result.rows || result.rows.length === 0) return null;
    
        const row = result.rows[0];
        return row.url; // Retornamos solo la URL en lugar de un objeto completo
    }

}
*/