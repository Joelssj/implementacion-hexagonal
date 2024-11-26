import { Router } from "express";
import { createUserController, loginController, getUserByUuidController, deleteUserByUuidController, updateUserByUuidController } from "../dependencies/dependencies";
import { RabbitMQPublisher } from "../rabbitmq/RabbitMQPublisher"; // Importa el publicador de eventos

const router = Router();

// Rutas existentes
router.post("/create", (req, res) => createUserController.run(req, res));
router.post("/login", (req, res) => loginController.run(req, res));
router.get("/get/:uuid", (req, res) => getUserByUuidController.run(req, res));
router.delete("/delete/:uuid", (req, res) => deleteUserByUuidController.run(req, res));
router.put("/update/:uuid", (req, res) => updateUserByUuidController.run(req, res));

// Nueva ruta para publicar un evento a RabbitMQ
router.post("/event", async (req, res) => {
    const { userUuid } = req.body;

    // Validación del cuerpo de la solicitud
    if (!userUuid) {
        return res.status(400).json({ error: "El campo 'userUuid' es obligatorio." });
    }

    try {
        // Crear instancia del publicador
        const publisher = new RabbitMQPublisher();

        // Publicar el evento en la cola `user_events`
        await publisher.publish("user_events", { userUuid });

        // Confirmar éxito
        console.log("📤 Evento de usuario publicado con éxito:", { userUuid });
        return res.status(200).json({ message: "Evento publicado correctamente" });
    } catch (error) {
        // Manejo de errores
        console.error("Error al publicar evento de usuario:", error);
        return res.status(500).json({ error: "Error al publicar el evento" });
    }
});

export { router as userRouter };













/*import { Router } from "express";
import { createUserController, loginController, getUserByUuidController, deleteUserByUuidController, updateUserByUuidController } from "../dependencies/dependencies";
import { RabbitMQPublisher } from "../rabbitmq/RabbitMQPublisher"; // Importa el publicador de eventos

const router = Router();

// Rutas existentes
router.post("/create", (req, res) => createUserController.run(req, res));
router.post("/login", (req, res) => loginController.run(req, res));
router.get("/get/:uuid", (req, res) => getUserByUuidController.run(req, res));
router.delete("/delete/:uuid", (req, res) => deleteUserByUuidController.run(req, res));
router.put("/update/:uuid", (req, res) => updateUserByUuidController.run(req, res));

// Nueva ruta para publicar un evento a RabbitMQ
router.post("/event", async (req, res) => {
    const { userUuid } = req.body;

    if (!userUuid) {
        return res.status(400).json({ error: "El campo 'userUuid' es obligatorio." });
    }

    try {
        const publisher = new RabbitMQPublisher();
        await publisher.publish("user_events", { userUuid });
        console.log("📤 Evento de usuario publicado con éxito:", { userUuid });
        return res.status(200).json({ message: "Evento publicado correctamente" });
    } catch (error) {
        console.error("Error al publicar evento de usuario:", error);
        return res.status(500).json({ error: "Error al publicar el evento" });
    }
});

export { router as userRouter };*/












/*import { Router } from "express";
import { createUserController, loginController, getUserByUuidController, deleteUserByUuidController, updateUserByUuidController } from "../dependencies/dependencies";


const router = Router();

router.post("/create", (req, res) => createUserController.run(req, res));
router.post("/login", (req, res) => loginController.run(req, res));
router.get("/get/:uuid", (req, res) => getUserByUuidController.run(req, res));
router.delete("/delete/:uuid", (req, res) => deleteUserByUuidController.run(req, res));
router.put("/update/:uuid", (req, res) => updateUserByUuidController.run(req, res));

export { router as userRouter };
*/