import { Request, Response } from "express";
import { ValidateUserTokenUseCase } from "../../application/ValidateTokenUseCase";

export class ValidateUserTokenController {
    constructor(private readonly validateUserTokenUseCase: ValidateUserTokenUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { userUuid, tokenValue } = req.body;

        try {
            await this.validateUserTokenUseCase.run(userUuid, tokenValue);
            return res.status(200).json({ message: "Usuario activado correctamente" });
        } catch (error: any) {  
            return res.status(400).json({ error: error.message });
        }
    }
}
