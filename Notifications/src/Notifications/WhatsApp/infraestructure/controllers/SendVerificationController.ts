import { Request, Response } from "express";
import { SendVerificationCodeUseCase } from "../../application/SendVerificationCodeUseCase";

export class SendVerificationController {
    private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase;

    constructor(sendVerificationCodeUseCase: SendVerificationCodeUseCase) {
        this.sendVerificationCodeUseCase = sendVerificationCodeUseCase;
    }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { nombre, apellido, correo, numero } = req.body;

            await this.sendVerificationCodeUseCase.run(nombre, apellido, correo, numero);

            return res.status(201).json({ message: "Lead creado y código de verificación enviado" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
