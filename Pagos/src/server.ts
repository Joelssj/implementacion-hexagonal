import { Signale } from "signale";
import express from "express";
import paymentRoutes from './MercadoPago/infrastructure/routes/PaymentRoutes';
import webhookRoutes from '../../Pagos/src/Webhook/infraestructure/routes/webhookRoutes';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const signale = new Signale();
app.use(express.json());
app.use(cors());
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/payment/webhook', webhookRoutes);


const port = 3002;
const host = '0.0.0.0';

app.listen(port, host, () => {
  signale.success("Server online in port 3010");
});




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
