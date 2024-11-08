export class MessageLog {
    constructor(
        public uuid: string,          // ID único del mensaje
        public to: string,            // Número de teléfono o destinatario
        public message: string,       // Contenido del mensaje
        public sentAt: Date           // Fecha y hora de envío
    ) {}
}
