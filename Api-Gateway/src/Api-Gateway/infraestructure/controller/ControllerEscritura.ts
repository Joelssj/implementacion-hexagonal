import { Request, Response } from 'express';
import { ForwardRequestUseCase } from '../../application/ForwardRequestUseCase';
import { AxiosGatewayServiceAdapter } from '../adapter/AxiosGatewayAdapter';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Leer la URL base del servicio desde el archivo .env para el puerto 3003
const serviceBaseUrl = process.env.ESCRITURA_SERVICE_BASE_URL;

if (!serviceBaseUrl) {
  throw new Error('ESCRITURA_SERVICE_BASE_URL is not defined in the .env file');
}

const gatewayAdapter = new AxiosGatewayServiceAdapter();
const forwardRequestUseCase = new ForwardRequestUseCase(gatewayAdapter);

export class ControllerEscritura {
  // Método para redirigir solicitudes POST
  static async forwardToEscrituraService(req: Request, res: Response) {
    try {
      console.log('Received request to Escritura service with path:', req.originalUrl, 'and method:', req.method);

      const escrituraServiceUrl = serviceBaseUrl;

      if (!escrituraServiceUrl) {
        return res.status(500).json({ error: 'Escritura service base URL is not defined' });
      }

      const forwardPath = req.originalUrl;

      console.log('Forwarding request to escritura service URL:', escrituraServiceUrl + forwardPath);

      const response = await forwardRequestUseCase.execute(escrituraServiceUrl, req.method.toLowerCase(), forwardPath, req.body);

      console.log('Response from escritura service:', response);

      res.json(response);
    } catch (error) {
      console.error('Error forwarding request to escritura service:', error);
      res.status(500).json({ error: 'Escritura service request failed' });
    }
  }
}
