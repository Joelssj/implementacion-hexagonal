export class Diary {
    constructor(
        public readonly id: string,
        public readonly userUuid: string, // Identifica al usuario al que pertenece
        public readonly image: string, // URL o base64 de la imagen
        public readonly comment: string, // Comentario asociado
        public readonly date: string, // Fecha del diario
        public readonly time: string // Hora del diario
    ) {}
}
