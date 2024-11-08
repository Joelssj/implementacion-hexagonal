import { Request, Response } from "express";
import { GetLeadByUuidUseCase } from "../../../application/GetLeadByUuidUseCase";

export class GetLeadByUuidController {
    constructor(private readonly getLeadByUuidUseCase: GetLeadByUuidUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { uuid } = req.params;
            const lead = await this.getLeadByUuidUseCase.run(uuid);
            return res.status(200).json(lead);
        } catch (error) {
            return res.status(404).json({ error: (error as Error).message });
        }
    }
}
