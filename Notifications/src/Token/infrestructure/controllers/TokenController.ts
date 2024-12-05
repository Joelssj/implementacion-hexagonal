import { Request, Response } from "express";
import { ValidateUserTokenUseCase } from "../../application/ValidateTokenUseCase";

export class ValidateUserTokenController {
    constructor(private readonly validateUserTokenUseCase: ValidateUserTokenUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        // Extraer los parámetros userUuid y tokenValue del cuerpo de la solicitud
        const { userUuid, tokenValue } = req.body;

        try {
            // Llamar al caso de uso con los parámetros necesarios
            await this.validateUserTokenUseCase.run(userUuid, tokenValue);
            return res.status(200).json({ message: "Usuario activado correctamente" });
        } catch (error: any) {  
            // Si ocurre un error, devolver el mensaje de error
            return res.status(400).json({ error: error.message });
        }
    }
}
