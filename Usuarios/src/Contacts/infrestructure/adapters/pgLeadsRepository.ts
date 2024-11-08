import { LeadsRepository } from "../../domain/LeadsRepository";
import { Lead } from "../../domain/Lead";
import { query } from "../../../database/pg/pg";

export class PgLeadsRepository implements LeadsRepository {
    async saveLead(lead: Lead): Promise<void> {
        const sql = `
            INSERT INTO leads (uuid, first_name, last_name, correo, phone, notification_preference)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const params = [lead.uuid, lead.first_Name, lead.last_Name, lead.correo, lead.phone, lead.notificationPreference];
        await query(sql, params);
    }

    async getLeadByUuid(uuid: string): Promise<Lead | null> {
        const sql = "SELECT * FROM leads WHERE uuid = $1";
        const params = [uuid];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const lead = result.rows[0];
        return new Lead(
            lead.uuid,
            lead.first_name,
            lead.last_name,
            lead.correo,
            lead.phone,
            lead.notification_preference
        );
    }

    async deleteLeadByUuid(uuid: string): Promise<void> {
        const sql = "DELETE FROM leads WHERE uuid = $1";
        const params = [uuid];
        await query(sql, params);
    }

    async getByEmail(correo: string): Promise<Lead | null> {
        const sql = "SELECT * FROM leads WHERE correo = $1";
        const params = [correo];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const lead = result.rows[0];
        return new Lead(
            lead.uuid,
            lead.first_name,
            lead.last_name,
            lead.correo,
            lead.phone,
            lead.notification_preference
        );
    }

    async updateLead(lead: Lead): Promise<void> {
        const sql = `
            UPDATE leads
            SET first_name = $1,
                last_name = $2,
                correo = $3,
                phone = $4,
                notification_preference = $5
            WHERE uuid = $6
        `;
        const params = [
            lead.first_Name,
            lead.last_Name,
            lead.correo,
            lead.phone,
            lead.notificationPreference,
            lead.uuid
        ];
        await query(sql, params);
        console.log(`✅ Lead actualizado en PostgreSQL con UUID: ${lead.uuid}`);
    }

    async getAllLeads(): Promise<Lead[]> {
        const sql = "SELECT * FROM leads";
        const params: any[] = []; // Especificamos un arreglo vacío si no hay parámetros
    
        const result = await query(sql, params);
    
        // Verificamos si `result` es `null` o no tiene filas
        if (!result || !result.rows) {
            return []; // Retorna un arreglo vacío si no hay resultados
        }
    
        return result.rows.map((row) => new Lead(
            row.uuid,
            row.first_name,
            row.last_name,
            row.correo,
            row.phone,
            row.notification_preference
        ));
    }
    

}



/*import { LeadsRepository } from "../../domain/LeadsRepository";
import { Lead } from "../../domain/Lead";
import { query } from "../../../database/pg/pg";

export class PgLeadsRepository implements LeadsRepository {
    async saveLead(lead: Lead): Promise<void> {
        const sql = `
            INSERT INTO leads (uuid, first_name, last_name, email, phone)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const params = [lead.uuid, lead.first_Name, lead.last_Name, lead.email, lead.phone];
        await query(sql, params);
    }

    async getLeadByUuid(uuid: string): Promise<Lead | null> {
        const sql = "SELECT * FROM leads WHERE uuid = $1";
        const params = [uuid];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const lead = result.rows[0];
        return new Lead(lead.uuid, lead.first_name, lead.last_name, lead.email, lead.phone);
    }

    async deleteLeadByUuid(uuid: string): Promise<void> {
        const sql = "DELETE FROM leads WHERE uuid = $1";
        const params = [uuid];
        await query(sql, params);
    }

    // Nuevo método para buscar por correo electrónico
    async getByEmail(email: string): Promise<Lead | null> {
        const sql = "SELECT * FROM leads WHERE email = $1";
        const params = [email];
        const result = await query(sql, params);

        if (!result || !result.rows || result.rows.length === 0) return null;

        const lead = result.rows[0];
        return new Lead(lead.uuid, lead.first_name, lead.last_name, lead.email, lead.phone);
    }

    async updateLead(lead: Lead): Promise<void> {
        const sql = `
            UPDATE leads
            SET first_name = $1,
                last_name = $2,
                email = $3,
                phone = $4
            WHERE uuid = $5
        `;
        const params = [lead.first_Name, lead.last_Name, lead.email, lead.phone, lead.uuid];
        await query(sql, params);
        console.log(`✅ Lead actualizado en PostgreSQL con UUID: ${lead.uuid}`);
    }


}
*/