export class User {
    constructor(
        public uuid: string,
        public correo: string,
        public password: string,
        public isActive: boolean,
        public leadUuid: string | null, // Permitir que sea `null`
        public notificationPreference: 'email' | 'whatsapp' // Preferencia de notificación
    ) {}
}
