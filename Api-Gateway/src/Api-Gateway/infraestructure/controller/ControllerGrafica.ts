import { Request, Response } from 'express';
import { ForwardRequestUseCase } from '../../application/ForwardRequestUseCase';
import { AxiosGatewayServiceAdapter } from '../adapter/AxiosGatewayAdapter';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Leer la URL base del servicio desde el archivo .env para el puerto 5000
const serviceBaseUrl = process.env.GRAFICA_SERVICE_BASE_URL;

if (!serviceBaseUrl) {
  throw new Error('GRAFICA_SERVICE_BASE_URL is not defined in the .env file');
}

const gatewayAdapter = new AxiosGatewayServiceAdapter();
const forwardRequestUseCase = new ForwardRequestUseCase(gatewayAdapter);

export class ControllerGrafica {
  // Método para redirigir solicitudes POST
  static async forwardToGraficaService(req: Request, res: Response) {
    try {
      console.log('Received request to Grafica service with path:', req.originalUrl, 'and method:', req.method);

      const graficaServiceUrl = serviceBaseUrl;

      if (!graficaServiceUrl) {
        return res.status(500).json({ error: 'Grafica service base URL is not defined' });
      }

      // Eliminar la barra extra entre la base URL y el path
      const forwardPath = req.originalUrl.replace(/\/$/, ''); // Eliminar barra final, si existe

      console.log('Forwarding request to grafica service URL:', graficaServiceUrl + forwardPath);

      const response = await forwardRequestUseCase.execute(graficaServiceUrl, req.method.toLowerCase(), forwardPath, req.body);

      console.log('Response from grafica service:', response);

      res.json(response);
    } catch (error) {
      console.error('Error forwarding request to grafica service:', error);
      res.status(500).json({ error: 'Grafica service request failed' });
    }
  }

  // Método para manejar el GET de emociones
  static async getEmociones(req: Request, res: Response) {
    try {
      console.log('Received GET request to Grafica service with query:', req.query, 'and method:', req.method);

      const graficaServiceUrl = serviceBaseUrl;

      if (!graficaServiceUrl) {
        return res.status(500).json({ error: 'Grafica service base URL is not defined' });
      }

      // Asegurarnos de que la ruta y las query params estén correctamente formateados
      const forwardPath = req.originalUrl;

      console.log('Forwarding GET request to grafica service URL:', graficaServiceUrl + forwardPath);

      const response = await forwardRequestUseCase.execute(graficaServiceUrl, req.method.toLowerCase(), forwardPath, req.query);

      console.log('Response from grafica service:', response);

      res.json(response);
    } catch (error) {
      console.error('Error forwarding GET request to grafica service:', error);
      res.status(500).json({ error: 'Grafica service request failed' });
    }
  }
}
