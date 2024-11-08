// adapters/MySQLWebhookRepository.ts
import { Webhook } from '../../domain/Webhook';
import { WebhookRepository } from '../../domain/WebhookRepository';
import { query } from '../../../database/mysql/mysql'; // Tu conexión a la base de datos


export class MySQLWebhookRepository implements WebhookRepository {
    async saveWebhook(webhook: Webhook): Promise<void> {
        const sql = "INSERT INTO webhooks (id, type, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
        const params = [
            webhook.id,
            webhook.type,
            JSON.stringify(webhook.data),
            webhook.createdAt,
            webhook.updatedAt,
        ];
        await query(sql, params);
    }

    async getWebhookById(id: string): Promise<Webhook> {
        const sql = "SELECT * FROM webhooks WHERE id = ?";
        const params = [id];
        const [rows]: any = await query(sql, params);

        if (rows.length === 0) {
            throw new Error(`Webhook with id ${id} not found`);
        }

        const webhook = rows[0];
        return new Webhook(
            webhook.id,
            webhook.type,
            JSON.parse(webhook.data), // Convertir data de JSON a objeto
            webhook.created_at,
            webhook.updated_at
        );
    }

    async getAllWebhooks(): Promise<Webhook[]> {
        const sql = "SELECT * FROM webhooks";
        const [rows]: any = await query(sql, []);

        return rows.map((row: any) => new Webhook(
            row.id,
            row.type,
            JSON.parse(row.data), // Convertir data de JSON a objeto
            row.created_at,
            row.updated_at
        ));
    }

    async updateWebhook(webhook: Webhook): Promise<void> {
        const sql = "UPDATE webhooks SET type = ?, data = ?, updated_at = ? WHERE id = ?";
        const params = [webhook.type, JSON.stringify(webhook.data), new Date(), webhook.id];
        await query(sql, params);
    }
}
