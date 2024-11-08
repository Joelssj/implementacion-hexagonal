import { UsersRepository } from "../../domain/UsersRepository";
import { User } from "../../domain/User";
import { query } from "../../../database/pg/pg";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class PgUsersRepository implements UsersRepository {
    async saveUser(user: User): Promise<void> {
        const sql = `
            INSERT INTO users (uuid, correo, password, is_active, lead_uuid, notification_preference)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const params = [user.uuid, user.correo, user.password, user.isActive, user.leadUuid, user.notificationPreference];
        await query(sql, params);
    }

    async activateUser(userUuid: string): Promise<void> {
        console.log(`Ejecutando activación para el usuario con UUID: ${userUuid}`);
        const sql = "UPDATE users SET is_active = true WHERE uuid = $1";
        const params = [userUuid];
        await query(sql, params);
        console.log(`✔️ Usuario ${userUuid} activado en la base de datos PostgreSQL`);
    }

    async getUserByEmail(correo: string): Promise<User | null> {
        const sql = "SELECT * FROM users WHERE correo = $1";
        const params = [correo];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const user = result.rows[0];
        return new User(user.uuid, user.correo, user.password, user.is_active, user.lead_uuid, user.notification_preference);
    }

    async getByUuid(uuid: string): Promise<User | null> {
        const sql = "SELECT * FROM users WHERE uuid = $1";
        const params = [uuid];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const user = result.rows[0];
        return new User(user.uuid, user.correo, user.password, user.is_active, user.lead_uuid, user.notification_preference);
    }

    async login(correo: string, password: string): Promise<User | null> {
        try {
            const sql = "SELECT * FROM users WHERE correo = $1";
            const params = [correo];
            const result = await query(sql, params);

            if (!result || !result.rows || result.rows.length === 0) return null;

            const user = result.rows[0];
            if (user && await bcrypt.compare(password, user.password)) {
                return new User(user.uuid, user.correo, user.password, user.is_active, user.lead_uuid, user.notification_preference);
            }

            return null;
        } catch (error) {
            console.error("Error en login:", error);
            throw new Error("Error en el proceso de login");
        }
    }

    async getUserByUuid(uuid: string): Promise<User | null> {
        const sql = "SELECT * FROM users WHERE uuid = $1";
        const params = [uuid];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const user = result.rows[0];
        return new User(user.uuid, user.correo, user.password, user.is_active, user.lead_uuid, user.notification_preference);
    }

    async deleteUserByUuid(uuid: string): Promise<void> {
        const sql = "DELETE FROM users WHERE uuid = $1";
        const params = [uuid];
        await query(sql, params);
    }

    async updateUser(user: User): Promise<void> {
        const sql = `
            UPDATE users
            SET correo = $1,
                password = $2,
                is_active = $3,
                notification_preference = $4
            WHERE uuid = $5
        `;
        const params = [user.correo, user.password, user.isActive, user.notificationPreference, user.uuid];
        await query(sql, params);
    }

    async save(userData: { correo: string; password: string; confirmPassword: string; notificationPreference: 'email' | 'whatsapp' }): Promise<User> {
        // Verificar que las contraseñas coinciden
        if (userData.password !== userData.confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        // Generar UUID y encriptar la contraseña
        const uuid = uuidv4();
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Crear instancia de usuario
        const user = new User(uuid, userData.correo, hashedPassword, false, null, userData.notificationPreference);

        // Guardar el usuario en la base de datos
        await this.saveUser(user);
        return user;
    }
}




/*// PgUsersRepository.ts
import { UsersRepository } from "../../domain/UsersRepository";
import { User } from "../../domain/User";
import { query } from "../../../database/pg/pg";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class PgUsersRepository implements UsersRepository {
    async saveUser(user: User): Promise<void> {
        const sql = "INSERT INTO users (uuid, correo, password, is_active, lead_uuid) VALUES ($1, $2, $3, $4, $5)";
        const params = [user.uuid, user.correo, user.password, user.isActive, user.leadUuid];
        await query(sql, params);
    }

    async activateUser(userUuid: string): Promise<void> {
        console.log(`Ejecutando activación para el usuario con UUID: ${userUuid}`);
        const sql = "UPDATE users SET is_active = true WHERE uuid = $1";
        const params = [userUuid];
        await query(sql, params);
        console.log(`✔️ Usuario ${userUuid} activado en la base de datos PostgreSQL`);
    }

    async getUserByEmail(correo: string): Promise<User | null> {
        const sql = "SELECT * FROM users WHERE correo = $1";
        const params = [correo];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const user = result.rows[0];
        return new User(user.uuid, user.correo, user.password, user.is_active, user.lead_uuid);
    }

    async getByUuid(uuid: string): Promise<User | null> {
        const sql = "SELECT * FROM users WHERE uuid = $1";
        const params = [uuid];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const user = result.rows[0];
        return new User(user.uuid, user.correo, user.password, user.is_active, user.lead_uuid);
    }

    async login(correo: string, password: string): Promise<User | null> {
        try {
            const sql = "SELECT * FROM users WHERE correo = $1";
            const params = [correo];
            const result = await query(sql, params);

            if (!result || !result.rows || result.rows.length === 0) return null;

            const user = result.rows[0];
            if (user && await bcrypt.compare(password, user.password)) {
                return new User(user.uuid, user.correo, user.password, user.is_active, user.lead_uuid);
            }

            return null;
        } catch (error) {
            console.error("Error en login:", error);
            throw new Error("Error en el proceso de login");
        }
    }

    async getUserByUuid(uuid: string): Promise<User | null> {
        const sql = "SELECT * FROM users WHERE uuid = $1";
        const params = [uuid];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const user = result.rows[0];
        return new User(user.uuid, user.correo, user.password, user.is_active, user.lead_uuid);
    }

    async deleteUserByUuid(uuid: string): Promise<void> {
        const sql = "DELETE FROM users WHERE uuid = $1";
        const params = [uuid];
        await query(sql, params);
    }

    async updateUser(user: User): Promise<void> {
        const sql = "UPDATE users SET correo = $1, password = $2, is_active = $3 WHERE uuid = $4";
        const params = [user.correo, user.password, user.isActive, user.uuid];
        await query(sql, params);
    }

    async save(userData: { correo: string; password: string; confirmPassword: string }): Promise<User> {
        // Verificar que las contraseñas coinciden
        if (userData.password !== userData.confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        // Generar UUID y encriptar la contraseña
        const uuid = uuidv4();
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Crear instancia de usuario
        const user = new User(uuid, userData.correo, hashedPassword, false, null);

        // Guardar el usuario en la base de datos
        await this.saveUser(user);
        return user;
    }
}

*/