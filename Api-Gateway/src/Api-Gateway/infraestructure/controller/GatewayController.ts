import { Request, Response } from 'express';
import { ForwardRequestUseCase } from '../../application/ForwardRequestUseCase';
import { AxiosGatewayServiceAdapter } from '../adapter/AxiosGatewayAdapter';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Leer la URL base del servicio desde el archivo .env
const serviceBaseUrl = process.env.SERVICE_BASE_URL;

if (!serviceBaseUrl) {
  throw new Error('SERVICE_BASE_URL is not defined in the .env file');
}

const gatewayAdapter = new AxiosGatewayServiceAdapter();
const forwardRequestUseCase = new ForwardRequestUseCase(gatewayAdapter);

export class GatewayController {
  static async forwardToService(req: Request, res: Response) {
    try {
      console.log('Received request to Gateway with path:', req.originalUrl, 'and method:', req.method);

      // La URL base ya está definida en el .env
      const serviceUrl = serviceBaseUrl;  // serviceUrl es de tipo string

      // Si serviceUrl es undefined, devolver un error o lanzar una excepción
      if (!serviceUrl) {
        return res.status(500).json({ error: 'Service base URL is not defined' });
      }

      // La ruta completa para el microservicio
      const forwardPath = req.originalUrl;

      // Debugging: verifica la URL final
      console.log('Forwarding request to service URL:', serviceUrl + forwardPath);

      // Redirige la solicitud al microservicio correspondiente
      const response = await forwardRequestUseCase.execute(serviceUrl, req.method.toLowerCase(), forwardPath, req.body);

      console.log('Response from microservice:', response);

      // Devuelve la respuesta del microservicio al cliente
      res.json(response);
    } catch (error) {
      console.error('Error forwarding request:', error);
      res.status(500).json({ error: 'Service request failed' });
    }
  }
}






























// import { Request, Response } from 'express';
// import { ForwardRequestUseCase } from '../../application/ForwardRequestUseCase';
// import { AxiosGatewayServiceAdapter } from '../adapter/AxiosGatewayAdapter';
// import dotenv from 'dotenv';

// // Cargar las variables de entorno desde el archivo .env
// dotenv.config();

// // Leer la URL base del servicio desde el archivo .env
// const serviceBaseUrl = process.env.SERVICE_BASE_URL;

// if (!serviceBaseUrl) {
//   throw new Error('SERVICE_BASE_URL is not defined in the .env file');
// }

// const gatewayAdapter = new AxiosGatewayServiceAdapter();
// const forwardRequestUseCase = new ForwardRequestUseCase(gatewayAdapter);

// export class GatewayController {
//   static async forwardToService(req: Request, res: Response) {
//     try {
//       console.log('Received request to Gateway with path:', req.originalUrl, 'and method:', req.method);

//       // La URL base ya está definida en el .env
//       const serviceUrl = serviceBaseUrl;  // serviceUrl es de tipo string

//       // Si serviceUrl es undefined, devolver un error o lanzar una excepción
//       if (!serviceUrl) {
//         return res.status(500).json({ error: 'Service base URL is not defined' });
//       }

//       // La ruta completa para el microservicio
//       const forwardPath = req.originalUrl;

//       // Debugging: verifica la URL final
//       console.log('Forwarding request to service URL:', serviceUrl + forwardPath);

//       // Redirige la solicitud al microservicio correspondiente
//       const response = await forwardRequestUseCase.execute(serviceUrl, req.method.toLowerCase(), forwardPath, req.body);

//       console.log('Response from microservice:', response);

//       // Devuelve la respuesta del microservicio al cliente
//       res.json(response);
//     } catch (error) {
//       console.error('Error forwarding request:', error);
//       res.status(500).json({ error: 'Service request failed' });
//     }
//   }
// }























// import { Request, Response } from 'express';
// import { ForwardRequestUseCase } from '../../application/ForwardRequestUseCase';
// import { AxiosGatewayServiceAdapter } from '../adapter/AxiosGatewayAdapter';
// import dotenv from 'dotenv';

// // Cargar las variables de entorno desde el archivo .env
// dotenv.config();

// // Leer la URL base del servicio desde el archivo .env
// const serviceBaseUrl = process.env.SERVICE_BASE_URL;

// if (!serviceBaseUrl) {
//   throw new Error('SERVICE_BASE_URL is not defined in the .env file');
// }

// const gatewayAdapter = new AxiosGatewayServiceAdapter();
// const forwardRequestUseCase = new ForwardRequestUseCase(gatewayAdapter);

// export class GatewayController {
//   static async forwardToService(req: Request, res: Response) {
//     try {
//       console.log('Received request to Gateway with path:', req.originalUrl, 'and method:', req.method);

//       // La URL del servicio (dominio + puerto) ya está definida en el .env
//       const serviceUrl = serviceBaseUrl;  // serviceUrl es de tipo string

//       // Si serviceUrl es undefined, devolver un error o lanzar una excepción
//       if (!serviceUrl) {
//         return res.status(500).json({ error: 'Service base URL is not defined' });
//       }

//       // Usa la ruta completa de la solicitud
//       const forwardPath = req.originalUrl;

//       // Debugging: verifica la URL final
//       console.log('Forwarding request to service URL:', serviceUrl + forwardPath);

//       // Redirige la solicitud al microservicio correspondiente
//       const response = await forwardRequestUseCase.execute(serviceUrl, req.method.toLowerCase(), forwardPath, req.body);

//       console.log('Response from microservice:', response);

//       // Devuelve la respuesta del microservicio al cliente
//       res.json(response);
//     } catch (error) {
//       console.error('Error forwarding request:', error);
//       res.status(500).json({ error: 'Service request failed' });
//     }
//   }
// }
