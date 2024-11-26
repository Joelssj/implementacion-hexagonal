import { Request, Response } from "express";
import { UpdateUserByUuidUseCase } from "../../application/UpdateUserByUuidUseCase";

export class UpdateUserByUuidController {
    constructor(private readonly updateUserByUuidUseCase: UpdateUserByUuidUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { correo, currentPassword, password, confirmPassword } = req.body;
        const { uuid } = req.params;

        // Validar que `uuid`, `correo`, `currentPassword`, `password`, y `confirmPassword` se hayan enviado
        if (!uuid || !correo || !currentPassword || !password || !confirmPassword) {
            return res.status(400).json({
                error: "Los campos 'uuid', 'correo', 'currentPassword', 'password', y 'confirmPassword' son obligatorios."
            });
        }

        try {
            // Ejecutar el caso de uso con solo los campos necesarios
            await this.updateUserByUuidUseCase.run(
                uuid,
                correo,
                currentPassword,  // Contraseña actual para validación
                password,
                confirmPassword  // Confirmación de la nueva contraseña
            );
            return res.status(200).json({ message: "Usuario actualizado correctamente" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return res.status(404).json({ error: errorMessage });
        }
    }
}
