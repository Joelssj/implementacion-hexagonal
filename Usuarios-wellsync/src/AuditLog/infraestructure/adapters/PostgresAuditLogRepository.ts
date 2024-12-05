import { AuditLog } from "../../domain/AuditLog";
import { query } from "../../../database/pg/pg"; // Asegúrate de que query esté correctamente configurado

export class PostgresAuditLogRepository {
    async save(auditLog: AuditLog): Promise<void> {
        // Validación de que el ID es un UUID válido
        if (!auditLog.id || typeof auditLog.id !== 'string' || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(auditLog.id)) {
            console.error('El ID proporcionado no es un UUID válido');
            throw new Error('ID inválido');
        }

        // Verifica que todos los campos sean válidos
        if (!auditLog.userId || !auditLog.actionType || !auditLog.details || !auditLog.timestamp) {
            console.error('Faltan campos necesarios para guardar el Audit Log');
            throw new Error('Campos faltantes');
        }

        // Consulta SQL para insertar los datos en la tabla
        const sql = `
            INSERT INTO audit_logs (id, user_id, action_type, details, timestamp)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const params = [auditLog.id, auditLog.userId, auditLog.actionType, auditLog.details, auditLog.timestamp];

        try {
            // Ejecuta la consulta
            const res = await query(sql, params);

            // Verificación de res antes de acceder a rowCount
            if (res && typeof res === 'object' && res.hasOwnProperty('rowCount') && res.rowCount !== null && res.rowCount > 0) {
                console.log("Audit Log guardado exitosamente en la base de datos.");
            } else {
                console.error("No se insertaron filas en la base de datos o error al obtener rowCount.");
            }
        } catch (error) {
            console.error("Error al guardar el Audit Log:", error);
            throw error; // Re-lanza el error para que el proceso falle si no se guarda correctamente
        }
    }
}
















// // PostgresAuditLogRepository.ts
// import { AuditLog } from "../../domain/AuditLog";
// import { query } from "../../../database/pg/pg";

// export class PostgresAuditLogRepository {
//     async save(auditLog: AuditLog): Promise<void> {
//         // Verifica que el id sea un UUID válido
//         if (!auditLog.id || typeof auditLog.id !== 'string' || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(auditLog.id)) {
//             console.error('El ID proporcionado no es un UUID válido');
//             throw new Error('ID inválido');
//         }

//         const sql = "INSERT INTO audit_logs (id, user_id, action_type, details, timestamp) VALUES ($1, $2, $3, $4, $5)";
//         const params = [auditLog.id, auditLog.userId, auditLog.actionType, auditLog.details, auditLog.timestamp];

//         try {
//             await query(sql, params);
//             console.log("Audit Log guardado exitosamente en la base de datos.");
//         } catch (error) {
//             console.error("Error al guardar el Audit Log:", error);
//             throw error; // Re-lanza el error para que el proceso falle si no se guarda correctamente
//         }
//     }
// }
