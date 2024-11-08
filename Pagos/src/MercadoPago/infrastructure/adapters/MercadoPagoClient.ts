// @ts-ignore
import mercadopago from "mercadopago";

export class MercadoPagoClient {
    constructor() {
        mercadopago.configure({
            access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
        });
    }

    async createPayment(email: string, amount: number): Promise<any> {
        console.log("Email recibido:", email);
        console.log("Amount recibido:", amount);

        const preference = {
            items: [
                {
                    title: "Suscripción a Servicio Premium",
                    quantity: 1,
                    currency_id: "MXN",
                    unit_price: amount,
                }
            ],
            payer: {
                email: email,
            },
            back_urls: {
                success: "https://tuapp.com/pago-exitoso",
                failure: "https://tuapp.com/pago-fallido",
                pending: "https://tuapp.com/pago-pendiente",
            },
            auto_return: "approved",
        };

        console.log("Preference data:", preference);
        const response = await mercadopago.preferences.create(preference);
        console.log("Respuesta de Mercado Pago:", response.body);

        return {
            id: response.body.id,
            init_point: response.body.init_point,
            status: response.body.status,
        };
    }

    // Método para obtener el estado del pago
    async getPaymentStatus(paymentId: string): Promise<string> {
        try {
            console.log("Solicitando estado para el pago ID:", paymentId);
            const response = await mercadopago.payment.get(paymentId);
            console.log("Respuesta de Mercado Pago:", response); // Agrega este log
            return response.body.status; // Devuelve el estado del pago
        } catch (error) {
            console.error("Error al obtener el estado del pago:", error); // Mensaje de error detallado
            throw new Error("No se pudo obtener el estado del pago.");
        }
    }
    
}



/*
// @ts-ignore
import mercadopago from "mercadopago";

export class MercadoPagoClient {
    constructor() {
        mercadopago.configure({
            access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
        });
    }

    async createPayment(email: string, amount: number): Promise<any> {
        console.log("Email recibido:", email);
        console.log("Amount recibido:", amount);

        const preference = {
            items: [
                {
                    title: "Suscripción a Servicio Premium",
                    quantity: 1,
                    currency_id: "MXN",
                    unit_price: amount,
                }
            ],
            payer: {
                email: email,
            },
            back_urls: {
                success: "https://tuapp.com/pago-exitoso",
                failure: "https://tuapp.com/pago-fallido",
                pending: "https://tuapp.com/pago-pendiente",
            },
            auto_return: "approved",
        };

        console.log("Preference data:", preference);
        const response = await mercadopago.preferences.create(preference);

        console.log("Respuesta de Mercado Pago:", response.body);

        return {
            id: response.body.id,
            init_point: response.body.init_point,
            status: response.body.status
        };
    }

    // Nuevo método para obtener el estado del pago
    async getPaymentStatus(paymentId: string): Promise<string> {
        const response = await mercadopago.payment.findById(paymentId);
        return response.body.status;
    }
}*/


/*// @ts-ignore
import mercadopago from "mercadopago";

export class MercadoPagoClient {
    constructor() {
        mercadopago.configure({
            access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
        });
    }

    async createPayment(email: string, amount: number): Promise<any> {
        // Log para verificar el email y el amount recibidos
        console.log("Email recibido:", email);
        console.log("Amount recibido:", amount);

        const preference = {
            items: [
                {
                    title: "Suscripción a Servicio Premium",
                    quantity: 1,
                    currency_id: "MXN",
                    unit_price: amount,  // Asegúrate de que unit_price esté correcto
                }
            ],
            payer: {
                email: email,
            },
            back_urls: {
                success: "https://tuapp.com/pago-exitoso",
                failure: "https://tuapp.com/pago-fallido",
                pending: "https://tuapp.com/pago-pendiente",
            },
            auto_return: "approved",
        };

        // Log para verificar la preferencia antes de enviarla
        console.log("Preference data:", preference);

        const response = await mercadopago.preferences.create(preference);

        // Log para verificar la respuesta de Mercado Pago
        console.log("Respuesta de Mercado Pago:", response.body);

        return {
            id: response.body.id,
            init_point: response.body.init_point,
            status: response.body.status
        };
    }
}
*/



  
  /*
  // @ts-ignore
  import mercadopago from "mercadopago";

  export class MercadoPagoClient {
      constructor() {
          mercadopago.configure({
              access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,  
          });
      }
  
      async createPayment(email: string, amount: number): Promise<any> {
          const preference = {
              items: [
                  {
                      title: "Suscripción a Servicio Premium",
                      quantity: 1,
                      currency_id: "MXN", 
                      unit_price: amount,  
                  }
              ],
              payer: {
                  email: email,  
              },
              back_urls: {
                  success: "https://tuapp.com/pago-exitoso",  
                  failure: "https://tuapp.com/pago-fallido",  
                  pending: "https://tuapp.com/pago-pendiente",  
              },
              auto_return: "approved",  
          };
  
          const response = await mercadopago.preferences.create(preference);
  

          return {
              id: response.body.id,  
              init_point: response.body.init_point,  
              status: response.body.status
          };
      }
  }
  
*/


