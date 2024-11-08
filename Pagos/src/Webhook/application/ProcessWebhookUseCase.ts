// application/ProcessWebhookUseCase.ts
import { PaymentRepository } from '../../MercadoPago/domain/PaymentRepository';
import { MercadoPagoClient } from '../../MercadoPago/infrastructure/adapters/MercadoPagoClient';
import { WebhookRepository } from '../domain/WebhookRepository';


export class ProcessWebhookUseCase {
    constructor(
        private paymentRepository: PaymentRepository,
        private webhookRepository: WebhookRepository,
        private mercadoPagoClient: MercadoPagoClient
    ) {}

    async run(type: string, paymentId: string): Promise<void> {
        // Verificar que el tipo de evento es 'payment'
        if (type !== 'payment') {
            throw new Error(`Tipo de webhook no soportado: ${type}`);
        }

        // Obtener el estado del pago desde Mercado Pago
        const paymentStatus = await this.mercadoPagoClient.getPaymentStatus(paymentId);

        // Actualizar el estado del pago en la base de datos
        await this.paymentRepository.updatePaymentStatus(paymentId, paymentStatus);

        // Guardar la información del webhook en la base de datos (opcional)
        const webhook = {
            id: paymentId,         // Puedes usar el ID del pago como ID del webhook
            type,
            data: { id: paymentId }, // Aquí puedes guardar más información si es necesario
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.webhookRepository.saveWebhook(webhook);
    }
}
