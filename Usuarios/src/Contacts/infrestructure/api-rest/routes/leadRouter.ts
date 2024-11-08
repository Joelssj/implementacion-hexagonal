import express from "express";
import { createLeadController, deleteLeadByUuidController, getLeadByUuidController, updateLeadController, getAllLeadsController } from "../dependencies/dependencies";

export const leadRouter = express.Router();


leadRouter.post("/create", createLeadController.run.bind(createLeadController));
leadRouter.get("/get/:uuid", (req, res) => getLeadByUuidController.run(req, res));
leadRouter.delete("/:uuid", (req, res) => deleteLeadByUuidController.run(req, res));
leadRouter.put("/update/:uuid", (req, res) => updateLeadController.run(req, res));
leadRouter.get("/getall", (req, res)=> getAllLeadsController.run(req, res));
