import { Request, Response } from 'express';
import { ForwardRequestUseCase } from '../../application/ForwardRequestUseCase';
import { AxiosGatewayServiceAdapter } from '../adapter/AxiosGatewayAdapter';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Leer la URL base del servicio desde el archivo .env para el puerto 3002
const serviceBaseUrl = process.env.PAYMENT_SERVICE_BASE_URL;

if (!serviceBaseUrl) {
  throw new Error('PAYMENT_SERVICE_BASE_URL is not defined in the .env file');
}

const gatewayAdapter = new AxiosGatewayServiceAdapter();
const forwardRequestUseCase = new ForwardRequestUseCase(gatewayAdapter);

export class PaymentController {
  static async createPayment(req: Request, res: Response) {
    try {
      console.log('Received request to Payment service with path:', req.originalUrl, 'and method:', req.method);

      // La URL base ya está definida en el .env
      const paymentServiceUrl = serviceBaseUrl;

      if (!paymentServiceUrl) {
        return res.status(500).json({ error: 'Payment service base URL is not defined' });
      }

      // La ruta completa para el microservicio
      const forwardPath = req.originalUrl.replace(/\/$/, '');  // Eliminar barra final, si existe

      console.log('Forwarding request to payment service URL:', paymentServiceUrl + forwardPath);

      // Redirige la solicitud al microservicio correspondiente
      const response = await forwardRequestUseCase.execute(paymentServiceUrl, req.method.toLowerCase(), forwardPath, req.body);

      console.log('Response from payment service:', response);

      // Devuelve la respuesta del microservicio al cliente
      res.json(response);
    } catch (error) {
      console.error('Error forwarding request to payment service:', error);
      res.status(500).json({ error: 'Payment service request failed' });
    }
  }
}
