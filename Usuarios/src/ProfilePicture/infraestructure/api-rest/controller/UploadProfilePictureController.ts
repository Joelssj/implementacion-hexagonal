import { Request, Response } from "express";
import { UploadProfilePictureUseCase } from "../../../application/UploadProfilePictureUseCase";

export class UploadProfilePictureController {
    constructor(private readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { userUuid } = req.params;

        console.log("UUID del usuario recibido en el controlador:", userUuid); // Verificar el UUID recibido

        if (!userUuid) {
            return res.status(400).json({ error: "El UUID del usuario es obligatorio en la URL." });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo." });
        }

        try {
            const fileBuffer = req.file.buffer;
            console.log("Archivo recibido en el controlador. Iniciando carga...");

            const profilePicture = await this.uploadProfilePictureUseCase.run(fileBuffer, userUuid);

            console.log("Foto de perfil subida exitosamente:", profilePicture);

            return res.status(200).json({
                message: "Foto de perfil subida exitosamente",
                profilePicture
            });
        } catch (error) {
            console.error("Error al subir la foto de perfil:", error);
            return res.status(500).json({ error: "Error al subir la foto de perfil." });
        }
    }
}
