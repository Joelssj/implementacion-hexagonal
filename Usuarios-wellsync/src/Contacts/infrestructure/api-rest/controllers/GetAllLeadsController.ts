import { Request, Response } from "express";
import { GetAllLeadsUseCase } from "../../../application/GetAllLeadsUseCase";


export class GetAllLeadsController {
    constructor(private readonly getAllLeadsUseCase: GetAllLeadsUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const leads = await this.getAllLeadsUseCase.run();
            return res.status(200).json(leads);
        } catch (error) {
            console.error("Error al obtener los leads:", error);
            return res.status(500).json({ error: "Error al obtener los leads" });
        }
    }
}
