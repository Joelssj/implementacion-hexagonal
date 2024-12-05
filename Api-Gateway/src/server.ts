import express from 'express';
import dotenv from 'dotenv';
import gatewayRoutes from './Api-Gateway/infraestructure/routes/GatewayRoutes';

dotenv.config();

const app = express();

// Configurar el middleware para manejar JSON
app.use(express.json());

// Configurar las rutas del API Gateway
app.use('/', gatewayRoutes);

// Definir el puerto y convertirlo a número
const PORT = Number(process.env.PORT) || 3000;  // Convierte a número
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
});








// import express from 'express';
// import dotenv from 'dotenv';
// import gatewayRoutes from './Api-Gateway/infraestructure/routes/GatewayRoutes'


// // Cargar las variables de entorno
// dotenv.config();

// // Crear la instancia de la aplicación Express
// const app = express();

// // Configurar el middleware para manejar JSON
// app.use(express.json());

// // Configurar las rutas del API Gateway
// app.use('/', gatewayRoutes);

// // Definir el puerto y arrancar el servidor
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`API Gateway running on port ${PORT}`);
// });














/*import { Signale } from "signale";
import express from "express";
import { paymentRouter } from "./MercadoPago/infrestructure/routes/paymentRouter";
import 'dotenv/config';
import cors from 'cors';

const app = express();
const signale = new Signale();
app.use(express.json());
app.use(cors());
app.use("/api/v1/payment", paymentRouter);

const port = 3002;
const host = '0.0.0.0';

app.listen(port, host, () => {
  signale.success("Server online in port 3001");
});
*/
