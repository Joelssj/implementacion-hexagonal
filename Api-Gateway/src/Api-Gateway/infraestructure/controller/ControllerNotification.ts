import { Request, Response } from 'express';
import { ForwardRequestUseCase } from '../../application/ForwardRequestUseCase';
import { AxiosGatewayServiceAdapter } from '../adapter/AxiosGatewayAdapter';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Leer la URL base del servicio desde el archivo .env para el puerto 3001
const serviceBaseUrl = process.env.NOTIFICATION_SERVICE_BASE_URL;

if (!serviceBaseUrl) {
  throw new Error('NOTIFICATION_SERVICE_BASE_URL is not defined in the .env file');
}

const gatewayAdapter = new AxiosGatewayServiceAdapter();
const forwardRequestUseCase = new ForwardRequestUseCase(gatewayAdapter);

export class ControllerNotification {
  static async forwardToNotificationService(req: Request, res: Response) {
    try {
      console.log('Received request to Notification service with path:', req.originalUrl, 'and method:', req.method);

      // La URL base ya está definida en el .env para el servicio de notificación
      const notificationServiceUrl = serviceBaseUrl;  // serviceUrl es de tipo string

      // Si notificationServiceUrl es undefined, devolver un error o lanzar una excepción
      if (!notificationServiceUrl) {
        return res.status(500).json({ error: 'Notification service base URL is not defined' });
      }

      // La ruta completa para el microservicio
      const forwardPath = req.originalUrl;

      // Debugging: verifica la URL final
      console.log('Forwarding request to notification service URL:', notificationServiceUrl + forwardPath);

      // Redirige la solicitud al microservicio de notificación correspondiente
      const response = await forwardRequestUseCase.execute(notificationServiceUrl, req.method.toLowerCase(), forwardPath, req.body);

      console.log('Response from notification service:', response);

      // Devuelve la respuesta del microservicio de notificación al cliente
      res.json(response);
    } catch (error) {
      console.error('Error forwarding request to notification service:', error);
      res.status(500).json({ error: 'Notification service request failed' });
    }
  }
}
