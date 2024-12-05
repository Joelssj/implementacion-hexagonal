import { Request, Response } from "express";
import { CreateUserEventUseCase } from "../../application/CreateUserEventUseCase";


export class UserEventController {
    constructor(private createUserEventUseCase: CreateUserEventUseCase) {}

    async createEvent(req: Request, res: Response): Promise<Response> {
        const { userUuid } = req.body;

        if (!userUuid) {
            return res.status(400).json({ error: "El campo 'userUuid' es obligatorio." });
        }

        try {
            await this.createUserEventUseCase.execute(userUuid);
            return res.status(201).json({ message: "Evento creado y publicado correctamente." });
        } catch (error) {
            console.error("Error al crear el evento:", error);
            return res.status(500).json({ error: "Error al crear el evento." });
        }
    }
}
