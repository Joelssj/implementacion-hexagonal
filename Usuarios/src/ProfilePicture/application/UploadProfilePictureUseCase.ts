import { ProfilePicture } from "../domain/ProfilePicture";
import { S3Service } from "../infraestructure/api-rest/service/S3Service";
import { ProfilePictureRepository } from "../domain/ProfilePictureRepository";

export class UploadProfilePictureUseCase {
    constructor(
        private readonly profilePictureRepository: ProfilePictureRepository,
        private readonly s3Service: S3Service
    ) {}

    async run(fileBuffer: Buffer, userUuid: string): Promise<ProfilePicture> {
        console.log("Iniciando la subida de la foto de perfil para el usuario con UUID:", userUuid);

        // Subir la foto a S3 y obtener la URL
        const profilePictureUrl = await this.s3Service.uploadProfilePicture(fileBuffer, userUuid);
        console.log("URL de la foto de perfil obtenida de S3:", profilePictureUrl);

        // Crear una nueva instancia de ProfilePicture
        const profilePicture = new ProfilePicture(undefined, userUuid, profilePictureUrl);
        console.log("Objeto ProfilePicture creado:", profilePicture);

        // Guardar la URL de la foto en la base de datos
        await this.profilePictureRepository.save(profilePicture);
        console.log("Foto de perfil guardada en la base de datos.");

        return profilePicture;
    }
}
