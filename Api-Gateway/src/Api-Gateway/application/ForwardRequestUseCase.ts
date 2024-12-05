export class ForwardRequestUseCase {
    constructor(private gatewayService: any) {}
  
    async execute(serviceUrl: string, method: string, path: string, data?: any): Promise<any> {
      console.log('Executing ForwardRequestUseCase');
      return this.gatewayService.forwardRequest(serviceUrl, method, path, data);
    }
  }
  