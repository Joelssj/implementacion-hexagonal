import { Request, Response } from "express";
import { GetProfilePictureByUserUuidUseCase } from "../../../application/GetProfilePictureByUserUuidUseCase";

export class GetProfilePictureByUserUuidController {
    constructor(private readonly getProfilePictureByUserUuidUseCase: GetProfilePictureByUserUuidUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { userUuid } = req.params;

        try {
            const profilePicture = await this.getProfilePictureByUserUuidUseCase.run(userUuid);

            if (!profilePicture) {
                return res.status(404).json({ error: "Foto de perfil no encontrada para el usuario." });
            }

            // Verificar si `profilePicture` es un objeto con `url`
            const url = typeof profilePicture === 'object' && 'url' in profilePicture ? profilePicture.url : null;
            if (!url) {
                return res.status(500).json({ error: "URL de la foto de perfil no encontrado." });
            }

            return res.status(200).json({ url });
        } catch (error) {
            console.error("Error al obtener la foto de perfil:", error);
            return res.status(500).json({ error: "Error al obtener la foto de perfil." });
        }
    }
}



/*
// GetProfilePictureByUserUuidController.ts
import { Request, Response } from "express";
import { GetProfilePictureByUserUuidUseCase } from "../../../application/GetProfilePictureByUserUuidUseCase";

export class GetProfilePictureByUserUuidController {
    constructor(private readonly getProfilePictureByUserUuidUseCase: GetProfilePictureByUserUuidUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        const { userUuid } = req.params;

        try {
            const profilePicture = await this.getProfilePictureByUserUuidUseCase.run(userUuid);

            if (!profilePicture) {
                return res.status(404).json({ error: "Foto de perfil no encontrada para el usuario." });
            }

            return res.status(200).json(profilePicture);
        } catch (error) {
            console.error("Error al obtener la foto de perfil:", error);
            return res.status(500).json({ error: "Error al obtener la foto de perfil." });
        }
    }
}*/