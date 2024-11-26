import { Request, Response } from "express";
import { CreatePasswordResetUseCase } from "../../application/CreatePasswordResetUseCase";

export class CreatePasswordResetController {
    constructor(private readonly createPasswordResetUseCase: CreatePasswordResetUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { email, notificationPreference } = req.body; // Incluye `notificationPreference`

        try {
            await this.createPasswordResetUseCase.run(email, notificationPreference); // Pasa `notificationPreference`
            return res.status(200).json({ message: "Se ha enviado un token para restablecer la contraseña." });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return res.status(500).json({ error: errorMessage });
        }
    }
}


