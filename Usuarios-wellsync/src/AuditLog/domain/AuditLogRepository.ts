// AuditLogRepository.ts
import { AuditLog } from "./AuditLog";

export interface AuditLogRepository {
    save(auditLog: AuditLog): Promise<void>;
    // Puedes agregar más métodos, como `find` para consultas
}
