// Importaciones necesarias
import { PgProfilePictureRepository } from "../adapter/PgProfilePictureRepository";
import { UploadProfilePictureUseCase } from "../../application/UploadProfilePictureUseCase";
import { UploadProfilePictureController } from "../api-rest/controller/UploadProfilePictureController";
import { GetProfilePictureByUserUuidController } from "../api-rest/controller/GetProfilePictureByUserUuidController";
import { GetProfilePictureByUserUuidUseCase } from "../../application/GetProfilePictureByUserUuidUseCase";
import { S3Service } from "../api-rest/service/S3Service";


// Repositorios
export const profilePictureRepository = new PgProfilePictureRepository();

// Servicios
export const s3Service = new S3Service(); 

// Caso de uso
export const uploadProfilePictureUseCase = new UploadProfilePictureUseCase(profilePictureRepository, s3Service);
export const getProfilePictureByUserUuidUseCase = new GetProfilePictureByUserUuidUseCase(profilePictureRepository);

// Controlador
export const uploadProfilePictureController = new UploadProfilePictureController(uploadProfilePictureUseCase);
export const getProfilePictureByUserUuidController = new GetProfilePictureByUserUuidController(getProfilePictureByUserUuidUseCase);
