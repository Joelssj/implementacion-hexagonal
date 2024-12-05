// passwordResetRouter.ts
import { Router } from "express";
import { createPasswordResetController, validateTokenController, resetPasswordController } from "../dependencies/dependencies";

const router = Router();

// Ruta para solicitar la recuperación de la contraseña
router.post("/password-reset", (req, res) => createPasswordResetController.run(req, res));

// Ruta para validar el token y obtener el UserUuid
router.post("/validate-token", (req, res) => validateTokenController.run(req, res));

// Ruta para restablecer la contraseña usando el UserUuid
router.post("/reset-password", (req, res) => resetPasswordController.run(req, res));

export { router as passwordResetRouter };



