import { MessageLog } from "./Twillio";

export interface TwilioRepository {
    sendMessage(to: string, message: string): Promise<MessageLog>; // Devuelve el log del mensaje
}
