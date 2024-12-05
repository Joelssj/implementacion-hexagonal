export interface GatewayServicePort {
    forwardRequest(serviceUrl: string, method: string, path: string, data: any): Promise<any>;
  }


  