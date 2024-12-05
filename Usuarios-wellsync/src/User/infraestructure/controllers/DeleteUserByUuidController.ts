import { Request, Response } from "express";
import { DeleteUserByUuidUseCase } from "../../application/DeleteUserByUuidUseCase";

export class DeleteUserByUuidController {
    constructor(private readonly deleteUserByUuidUseCase: DeleteUserByUuidUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { uuid } = req.params;
        
        try {
            await this.deleteUserByUuidUseCase.run(uuid);
            return res.status(200).json({ message: "Usuario eliminado correctamente" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return res.status(404).json({ error: errorMessage });
        }
    }
}
