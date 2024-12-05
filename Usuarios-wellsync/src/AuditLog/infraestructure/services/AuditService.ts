// AuditService.ts
import { PostgresAuditLogRepository } from "../adapters/PostgresAuditLogRepository";
import { AuditLog } from "../../domain/AuditLog";
import { v4 as uuidv4 } from "uuid";

export class AuditService {
    constructor(private readonly auditLogRepository: PostgresAuditLogRepository) {}

    async logAction(userId: string, actionType: string, details: string): Promise<void> {
        const auditLog = new AuditLog(uuidv4(), userId, actionType, details, new Date());
        await this.auditLogRepository.save(auditLog);
    }
}
