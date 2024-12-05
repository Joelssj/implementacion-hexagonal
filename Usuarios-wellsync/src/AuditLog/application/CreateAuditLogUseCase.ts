// src/AuditLog/application/CreateAuditLogUseCase.ts
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de tener esta librería importada
import { AuditLogRepository } from "../domain/AuditLogRepository";
import { AuditLog } from "../domain/AuditLog";

export class CreateAuditLogUseCase {
    constructor(private readonly auditLogRepository: AuditLogRepository) {}

    async execute(userId: string, actionType: string, details: string): Promise<void> {
        const auditLog = new AuditLog(
            uuidv4(), // Genera un UUID válido
            userId,
            actionType,
            details,
            new Date()
        );
        await this.auditLogRepository.save(auditLog);
        console.log("Audit Log guardado exitosamente en la base de datos.");
    }
}

