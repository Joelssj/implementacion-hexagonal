import express from "express";
import { tokenController } from "../dependencies/Dependencies"; // Asegúrate de que uses el nombre correcto (minúsculas o mayúsculas)

export const tokenRouter = express.Router();

tokenRouter.post("/validar-token", tokenController.run.bind(tokenController));

