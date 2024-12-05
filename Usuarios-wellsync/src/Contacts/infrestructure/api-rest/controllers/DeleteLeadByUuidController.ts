import { Request, Response } from "express";
import { DeleteLeadByUuidUseCase } from "../../../application/DeleteLeadByUuidUseCase";

export class DeleteLeadByUuidController {
    constructor(private readonly deleteLeadByUuidUseCase: DeleteLeadByUuidUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { uuid } = req.params;
            await this.deleteLeadByUuidUseCase.run(uuid);
            return res.status(200).json({ message: "Lead eliminado correctamente" });
        } catch (error) {
            return res.status(404).json({ error: (error as Error).message });
        }
    }
}
