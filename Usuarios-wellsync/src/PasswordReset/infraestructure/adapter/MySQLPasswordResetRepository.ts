import { PasswordResetRepository } from "../../domain/PasswordResetRepository";
import { PasswordReset } from "../../domain/PasswordReset";
import { query } from "../../../database/pg/pg";

export class MySQLPasswordResetRepository implements PasswordResetRepository {
    async savePasswordReset(passwordReset: PasswordReset): Promise<void> {
        const sql = "INSERT INTO password_resets (correo, token, created_at, expiration, is_active) VALUES ($1, $2, $3, $4, $5)";
        const params = [passwordReset.correo, passwordReset.token, passwordReset.createdAt, passwordReset.expiresAt, true];
        await query(sql, params);
    }

    async getPasswordResetByToken(token: string): Promise<PasswordReset | null> {
        const sql = "SELECT correo, token, created_at, expiration FROM password_resets WHERE token = $1 AND is_active = TRUE";
        const params = [token];
        const result: any = await query(sql, params);
        
        if (result.rows.length === 0) return null;

        const record = result.rows[0];
        // Retornamos el objeto con el correo extraído correctamente
        return new PasswordReset(record.correo, record.token, record.created_at, record.expiration);
    }

    async deactivateToken(token: string): Promise<void> {
        const sql = "UPDATE password_resets SET is_active = FALSE WHERE token = $1";
        const params = [token];
        await query(sql, params);
    }

    async deletePasswordReset(token: string): Promise<void> {
        const sql = "DELETE FROM password_resets WHERE token = $1";
        const params = [token];
        await query(sql, params);
    }
}


