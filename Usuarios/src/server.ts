import { Signale } from "signale";
import express from "express";
import { leadRouter } from "./Contacts/infrestructure/api-rest/routes/leadRouter";
import { userRouter } from "./User/infraestructure/routes/userRouter";
import 'dotenv/config';
import cors from 'cors';
import { RabbitMQService } from "./User/infraestructure/rabbitmq/RabbitMQService";
import { UserActivatedConsumer } from "./User/infraestructure/rabbitmq/UserActivatedConsumer"; // Asegúrate de tener esta importación correcta
import { usersRepository } from "./User/infraestructure/dependencies/dependencies";
import { profilePictureRouter } from "./ProfilePicture/infraestructure/routes/routes";


const app = express();
const signale = new Signale();

// Configuración de middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api/v1/lead", leadRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profilePictureRouter);

// Inicializar conexión con RabbitMQ y consumidor
async function initializeRabbitMQ() {
  try {
    const channel = await RabbitMQService.getChannel();
    console.log("RabbitMQ está conectado y listo");

    // Inicializar el consumidor
    const userActivatedConsumer = new UserActivatedConsumer(usersRepository);
    await userActivatedConsumer.start();

    console.log("Consumidor para la activación de usuarios inicializadooo");
  } catch (error) {
    console.error("Error al conectar con RabbitMQ o al inicializar el consumidor:", error);
  }
}

// Arrancar el servidor y establecer conexión con RabbitMQ
const port = 3010;
const host = '0.0.0.0';
app.listen(port, host, async () => {
  signale.success(`Server online in port ${port}`);
  await initializeRabbitMQ(); // Llamada para conectar a RabbitMQ e inicializar el consumidor
});




/*import { Signale } from "signale";
import express from "express";
import { leadRouter } from "./Contacts/infrestructure/api-rest/routes/leadRouter";
import { userRouter } from "./User/infraestructure/routes/userRouter";
import 'dotenv/config';
import cors from 'cors';

const app = express();
const signale = new Signale();
app.use(express.json());
app.use(cors());
app.use("/api/v1/lead", leadRouter);
app.use("/api/v1/users", userRouter);

const port = 3010;
const host = '0.0.0.0';

app.listen(port, host, () => {
  signale.success("Server online in port 3010");
});
*/
