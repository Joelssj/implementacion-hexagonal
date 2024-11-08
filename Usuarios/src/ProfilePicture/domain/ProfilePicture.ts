import { v4 as uuidv4 } from 'uuid';

export class ProfilePicture {
    constructor(
        public id: string = uuidv4(),    // Genera un UUID único para la imagen
        public userUuid: string,         // Referencia al UUID del usuario
        public url: string,              // URL de la imagen en S3
        public createdAt: Date = new Date() // Fecha de creación
    ) {}
}
