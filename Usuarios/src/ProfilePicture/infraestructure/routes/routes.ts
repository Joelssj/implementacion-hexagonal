import { Router } from "express";
import multer from "multer"; 
import { uploadProfilePictureController, getProfilePictureByUserUuidController } from "../dependencies/dependencies";

const router = Router();
const upload = multer(); // Configura multer para manejar el archivo en la solicitud

// Ruta para subir la foto de perfil
router.post("/picture/:userUuid", upload.single("profilePicture"), (req, res) => {uploadProfilePictureController.run(req, res);
router.get("/get/:userUuid", (req, res) => getProfilePictureByUserUuidController.run(req, res));
});

export { router as profilePictureRouter };
