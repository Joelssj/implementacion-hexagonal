// controllers/PaymentController.ts
import { Request, Response } from "express";
import { ProcessWebhookUseCase } from "../../application/ProcessWebhookUseCase";
import { PaymentRepository } from "../../../MercadoPago/domain/PaymentRepository";
import { WebhookRepository } from "../../domain/WebhookRepository";
import { MercadoPagoClient } from "../../../MercadoPago/infrastructure/adapters/MercadoPagoClient";

export class PaymentController {
    constructor(
        private processWebhookUseCase: ProcessWebhookUseCase,
        private paymentRepository: PaymentRepository,
        private webhookRepository: WebhookRepository,
        private mercadoPagoClient: MercadoPagoClient // Cliente de Mercado Pago
    ) {}

    async handleWebhook(req: Request, res: Response): Promise<Response> {
        console.log("Webhook recibido:", req.body); // Log de la solicitud entrante
    
        try {
            const { type, data } = req.body;
    
            // Verificar que `data` y `data.id` están presentes
            if (!data || !data.id) {
                console.error("Error: falta 'data' o 'id' en el cuerpo del webhook."); // Log de error
                return res.status(400).json({ error: "El cuerpo del webhook no contiene la propiedad 'data' o 'id'" });
            }
    
            console.log("Tipo de evento:", type); // Log del tipo de evento
            console.log("ID del pago:", data.id); // Log del ID del pago
    
            // Llamar al método para obtener el estado del pago
            const paymentStatus = await this.mercadoPagoClient.getPaymentStatus(data.id);
            console.log("Estado del pago:", paymentStatus);
    
            // Procesar el evento del webhook usando el caso de uso
            await this.processWebhookUseCase.run(type, data.id);
    
            console.log("Webhook procesado exitosamente."); // Log de éxito
            return res.status(200).send("Webhook recibido y procesado correctamente");
        } catch (error: any) {
            console.error("Error en el webhook:", error.message); // Log del error específico
            return res.status(500).json({ error: error.message });
        }
    }
    
}
