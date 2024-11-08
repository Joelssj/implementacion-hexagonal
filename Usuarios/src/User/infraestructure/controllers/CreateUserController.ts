import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/CreateUserAndSendTokenUseCase";

export class CreateUserController {
    constructor(private readonly createUserUseCase: CreateUserUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { correo, password, confirmPassword, notificationPreference } = req.body;

        try {
            // Verificar que se haya enviado `confirmPassword`
            if (!confirmPassword) {
                return res.status(400).json({
                    error: "La confirmación de contraseña es obligatoria."
                });
            }

            // Verificar que se haya enviado `notificationPreference` y que sea válido
            if (!notificationPreference || !['email', 'whatsapp'].includes(notificationPreference)) {
                return res.status(400).json({
                    error: "La preferencia de notificación es obligatoria y debe ser 'email' o 'whatsapp'."
                });
            }

            // Ejecuta el caso de uso que crea el usuario
            const user = await this.createUserUseCase.run(correo, password, confirmPassword, notificationPreference);

            // Devolver la respuesta con los datos del usuario creado
            return res.status(201).json({
                message: "Usuario creado exitosamente",
                user: {
                    uuid: user.uuid,
                    correo: user.correo,
                    leadUuid: user.leadUuid,
                    isActive: user.isActive,
                    notificationPreference: user.notificationPreference // Agregado a la respuesta
                }
            });
        } catch (error: unknown) {
            // Manejo de errores
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            
            return res.status(500).json({ error: errorMessage });
        }
    }
}




/*
// CreateUserController.ts
import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/CreateUserAndSendTokenUseCase";

export class CreateUserController {
    constructor(private readonly createUserUseCase: CreateUserUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { correo, password, confirmPassword } = req.body;

        try {
            // Verificar que se haya enviado `confirmPassword`
            if (!confirmPassword) {
                return res.status(400).json({
                    error: "La confirmación de contraseña es obligatoria."
                });
            }

            // Ejecuta el caso de uso que crea el usuario
            const user = await this.createUserUseCase.run(correo, password, confirmPassword);

            // Devolver la respuesta con los datos del usuario creado
            return res.status(201).json({
                message: "Usuario creado exitosamente",
                user: {
                    uuid: user.uuid,
                    correo: user.correo,
                    leadUuid: user.leadUuid,
                    isActive: user.isActive
                }
            });
        } catch (error: unknown) {
            // Manejo de errores
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            
            return res.status(500).json({ error: errorMessage });
        }
    }
}

*/