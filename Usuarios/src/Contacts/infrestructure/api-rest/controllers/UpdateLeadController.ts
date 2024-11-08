import { Request, Response } from "express";
import { UpdateLeadUseCase } from "../../../application/UpdateLeadUseCase";

export class UpdateLeadController {
    constructor(private readonly updateLeadUseCase: UpdateLeadUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { uuid } = req.params;
        const { first_Name, last_Name, email, phone, notificationPreference } = req.body;

        if (!uuid) {
            return res.status(400).json({ error: "El campo 'uuid' es obligatorio." });
        }

        try {
            const updatedLead = await this.updateLeadUseCase.run({
                uuid,
                first_Name,
                last_Name,
                email,
                phone,
                notificationPreference: notificationPreference || null // Pasamos null si no está definido
            });
            return res.status(200).json({
                message: "Lead actualizado exitosamente",
                lead: updatedLead
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            return res.status(500).json({ error: errorMessage });
        }
    }
}
