import { Request, Response } from "express";
import { CreatePaymentUseCase } from "../../application/CreatePaymentUseCase";
import { PaymentRepository } from "../../domain/PaymentRepository";
import { ProcessWebhookUseCase } from "../../application/ProcessWebhookUseCase";
import { MercadoPagoClient } from "../adapters/MercadoPagoClient";


export class PaymentController {
    private readonly createPaymentUseCase: CreatePaymentUseCase;
    private readonly paymentRepository: PaymentRepository;
    private readonly processWebhookUseCase: ProcessWebhookUseCase;
    private readonly mercadoPagoClient: MercadoPagoClient;

    constructor(
        createPaymentUseCase: CreatePaymentUseCase,
        paymentRepository: PaymentRepository,
        processWebhookUseCase: ProcessWebhookUseCase,
        mercadoPagoClient: MercadoPagoClient,
        
    ) {
        this.createPaymentUseCase = createPaymentUseCase;
        this.paymentRepository = paymentRepository;
        this.processWebhookUseCase = processWebhookUseCase;
        this.mercadoPagoClient = mercadoPagoClient;
        
    }

    // Método para crear un pago
    async createPayment(req: Request, res: Response): Promise<Response> {
        try {
            const { leadId, email, amount } = req.body;

            if (amount === undefined || amount === null) {
                return res.status(400).json({ error: "El monto (amount) es necesario para crear el pago." });
            }

            const paymentLink = await this.createPaymentUseCase.run(leadId, email, amount);

            return res.status(201).json({
                message: "Pago iniciado con éxito, sigue el link para completar el pago",
                paymentLink
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Método para obtener el estado del pago
    async getPaymentStatus(req: Request, res: Response): Promise<Response> {
      try {
          const { id } = req.params;
  
          // Obtener el estado del pago desde la API de Mercado Pago
          const paymentStatus = await this.mercadoPagoClient.getPaymentStatus(id);
  
          // Actualizar el estado en la base de datos, si es necesario
          await this.paymentRepository.updatePaymentStatus(id, paymentStatus);
  
          // Devolver el estado actualizado
          return res.status(200).json({ id, status: paymentStatus });
      } catch (error: any) {
          console.error("Error al obtener el estado del pago:", error.message);
          return res.status(404).json({ error: error.message });
      }
  }
  

    // Método para manejar el webhook de Mercado Pago
    async handleWebhook(req: Request, res: Response): Promise<Response> {
        try {
            const { type, data } = req.body;

            if (!data || !data.id) {
                return res.status(400).json({ error: "El cuerpo del webhook no contiene la propiedad 'data' o 'id'" });
            }

            const paymentId = data.id;
            const paymentStatus = await this.mercadoPagoClient.getPaymentStatus(paymentId);

            await this.updatePaymentStatus(paymentId, paymentStatus);

            return res.status(200).send("Webhook recibido y procesado correctamente");
        } catch (error: any) {
            console.error("Error en el webhook:", error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    // Método auxiliar para actualizar el estado del pago en la base de datos
    private async updatePaymentStatus(paymentId: string, status: string): Promise<void> {
        await this.paymentRepository. updatePaymentStatus(paymentId, status);
    }
}



/*
import { Request, Response } from "express";
import { CreatePaymentUseCase } from "../../application/CreatePaymentUseCase";
import { PaymentRepository } from "../../domain/PaymentRepository";
import { ProcessWebhookUseCase } from "../../application/ProcessWebhookUseCase";

export class PaymentController {
    private readonly createPaymentUseCase: CreatePaymentUseCase;
    private readonly paymentRepository: PaymentRepository;
    private readonly processWebhookUseCase: ProcessWebhookUseCase;

    constructor(
        createPaymentUseCase: CreatePaymentUseCase,
        paymentRepository: PaymentRepository,
        processWebhookUseCase: ProcessWebhookUseCase
    ) {
        this.createPaymentUseCase = createPaymentUseCase;
        this.paymentRepository = paymentRepository;
        this.processWebhookUseCase = processWebhookUseCase;
    }

    // Método para crear un pago
    async createPayment(req: Request, res: Response): Promise<Response> {
        try {
            const { leadId, email, amount } = req.body;

            // Verificar que amount esté presente
            if (amount === undefined || amount === null) {
                return res.status(400).json({ error: "El monto (amount) es necesario para crear el pago." });
            }

            // Iniciar el proceso de pago y generar el link de Mercado Pago
            const paymentLink = await this.createPaymentUseCase.run(leadId, email, amount);

            return res.status(201).json({
                message: "Pago iniciado con éxito, sigue el link para completar el pago",
                paymentLink
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Método para obtener el estado del pago
    async getPaymentStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            // Obtener el estado del pago usando el repositorio directamente
            const paymentStatus = await this.paymentRepository.getPaymentStatus(id);

            return res.status(200).json(paymentStatus);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    // Método para manejar el webhook de Mercado Pago
    async handleWebhook(req: Request, res: Response): Promise<Response> {
        try {
            const { type, data } = req.body;

            // Verificar que `data` y `data.id` están presentes antes de proceder
            if (!data || !data.id) {
                return res.status(400).json({ error: "El cuerpo del webhook no contiene la propiedad 'data' o 'id'" });
            }

            // Procesar el evento del webhook usando el caso de uso
            await this.processWebhookUseCase.run(type, data.id);

            return res.status(200).send("Webhook recibido y procesado correctamente");
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
*/
