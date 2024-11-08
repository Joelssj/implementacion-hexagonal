import { Router } from "express";
import { createUserController, loginController, getUserByUuidController, deleteUserByUuidController, updateUserByUuidController } from "../dependencies/dependencies";


const router = Router();

router.post("/create", (req, res) => createUserController.run(req, res));
router.post("/login", (req, res) => loginController.run(req, res));
router.get("/get/:uuid", (req, res) => getUserByUuidController.run(req, res));
router.delete("/delete/:uuid", (req, res) => deleteUserByUuidController.run(req, res));
router.put("/update/:uuid", (req, res) => updateUserByUuidController.run(req, res));

export { router as userRouter };
