import { MercadoPagoClient } from "../infrastructure/adapters/MercadoPagoClient";
import { PaymentRepository } from "../domain/PaymentRepository";
import { Payment } from "../domain/Payment";
import { EmailService } from "../infrastructure/services/EmailService"; 

export class CreatePaymentUseCase {
    private readonly mercadoPagoClient: MercadoPagoClient;
    private readonly paymentRepository: PaymentRepository;
    private readonly emailService: EmailService;

    constructor(mercadoPagoClient: MercadoPagoClient, paymentRepository: PaymentRepository, emailService: EmailService) {
        this.mercadoPagoClient = mercadoPagoClient;
        this.paymentRepository = paymentRepository;
        this.emailService = emailService;
    }

    async run(leadId: number, email: string, amount: number): Promise<string> {
      const paymentResponse = await this.mercadoPagoClient.createPayment(email, amount);
  

      const items = [
          {
              title: "Suscripción",
              quantity: 1,
              unit_price: amount
          }
      ];
  

      const payment = new Payment(
          paymentResponse.id,        
          items,                    
          email,                    
          leadId.toString(),        
          "pending"                  
      );
  

      await this.paymentRepository.savePayment(payment);
  
      return paymentResponse.init_point;
  }
}  
