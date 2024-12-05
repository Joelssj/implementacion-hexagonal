// AuditLogController.ts
import { Request, Response } from "express";
import { CreateAuditLogUseCase } from "../../application/CreateAuditLogUseCase";

export class AuditLogController {
    constructor(private readonly createAuditLogUseCase: CreateAuditLogUseCase) {}

    async logAction(req: Request, res: Response) {
        const { userId, actionType, details } = req.body;

        try {
            await this.createAuditLogUseCase.execute(userId, actionType, details);
            res.status(201).json({ message: "Registro de auditoría creado con éxito" });
        } catch (error) {
            console.error("Error en el registro de auditoría:", error);
            res.status(500).json({ message: "Error en el servidor al crear el registro de auditoría" });
        }
    }
}
