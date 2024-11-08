// routes/webhookRoutes.ts
import express from 'express';
import { PaymentController } from '../controller/PaymentController';
import { ProcessWebhookUseCase } from '../../application/ProcessWebhookUseCase';
import { MySQLPaymentRepository } from '../../../MercadoPago/infrastructure/adapters/MySQLPaymentRepository';
import { MySQLWebhookRepository } from '../adapter/MySQLWebhookRepository';// Asegúrate de importar la implementación
import { MercadoPagoClient } from '../../../MercadoPago/infrastructure/adapters/MercadoPagoClient';

const router = express.Router();

// Instancia de repositorios y servicios
const paymentRepository = new MySQLPaymentRepository();
const webhookRepository = new MySQLWebhookRepository(); // Asegúrate de usar la implementación correcta
const mercadoPagoClient = new MercadoPagoClient();

// Instancia del caso de uso
const processWebhookUseCase = new ProcessWebhookUseCase(paymentRepository, webhookRepository, mercadoPagoClient);

// Asegúrate de instanciar el PaymentController con todos los parámetros necesarios
const paymentController = new PaymentController(
    processWebhookUseCase,
    paymentRepository,
    webhookRepository,
    mercadoPagoClient
);

// Ruta para manejar el webhook de Mercado Pago
router.post('/mercadopago', (req, res) => paymentController.handleWebhook(req, res));

export default router;
