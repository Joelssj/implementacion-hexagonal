// AxiosGatewayServiceAdapter.ts
import axios from 'axios';

export class AxiosGatewayServiceAdapter {
  async forwardRequest(serviceUrl: string, method: string, path: string, data?: any): Promise<any> {
    try {
      const response = await axios({
        url: `${serviceUrl}${path}`,
        method,
        data: data ? data : undefined, // Asegúrate de enviar el `data` solo si está presente
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in AxiosGatewayServiceAdapter:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw new Error('Service request failed');
    }
  }
}