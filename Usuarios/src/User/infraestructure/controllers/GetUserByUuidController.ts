import { Request, Response } from "express";
import { GetUserByUuidUseCase } from "../../application/GetUserByUuidUseCase";

export class GetUserByUuidController {
    constructor(private readonly getUserByUuidUseCase: GetUserByUuidUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { uuid } = req.params;
        
        try {
            const user = await this.getUserByUuidUseCase.run(uuid);
            return res.status(200).json(user);  // Retorna el usuario encontrado
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return res.status(404).json({ error: errorMessage });
        }
    }
}
