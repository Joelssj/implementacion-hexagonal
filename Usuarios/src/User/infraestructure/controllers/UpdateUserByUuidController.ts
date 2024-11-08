import { Request, Response } from "express";
import { UpdateUserByUuidUseCase } from "../../application/UpdateUserByUuidUseCase";

export class UpdateUserByUuidController {
    constructor(private readonly updateUserByUuidUseCase: UpdateUserByUuidUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { uuid } = req.params;
        const { correo, password, confirmPassword, isActive, notificationPreference } = req.body;

        // Validar que `uuid`, `correo`, `password`, y `confirmPassword` se hayan enviado
        if (!uuid || !correo || !password || !confirmPassword) {
            return res.status(400).json({
                error: "Los campos 'uuid', 'correo', 'password', y 'confirmPassword' son obligatorios."
            });
        }

        // Validar la preferencia de notificación si se proporciona
        if (notificationPreference && !['email', 'whatsapp'].includes(notificationPreference)) {
            return res.status(400).json({
                error: "La preferencia de notificación debe ser 'email' o 'whatsapp' si se proporciona."
            });
        }

        try {
            await this.updateUserByUuidUseCase.run(
                uuid,
                correo,
                password,
                confirmPassword, // Agregamos `confirmPassword` para verificar en el caso de uso
                isActive ?? null, // Pasar `null` si `isActive` no está definido
                notificationPreference ?? null // Pasar `null` si `notificationPreference` no está definido
            );
            return res.status(200).json({ message: "Usuario actualizado correctamente" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return res.status(404).json({ error: errorMessage });
        }
    }
}
