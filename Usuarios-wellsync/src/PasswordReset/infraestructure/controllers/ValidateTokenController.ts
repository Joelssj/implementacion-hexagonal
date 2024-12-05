// ValidateTokenController.ts
import { Request, Response } from "express";
import { ValidateTokenUseCase } from "../../application/ValidateTokenUseCase";

export class ValidateTokenController {
    constructor(private readonly validateTokenUseCase: ValidateTokenUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { token } = req.body;

        try {
            const UserUuid = await this.validateTokenUseCase.run(token);
            return res.status(200).json({ UserUuid });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            return res.status(400).json({ error: errorMessage });
        }
    }
}
