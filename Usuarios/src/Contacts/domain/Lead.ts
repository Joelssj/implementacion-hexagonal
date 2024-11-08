export class Lead {
    constructor(
        public uuid: string,
        public first_Name: string,
        public last_Name: string,
        public correo: string,
        public phone: string,
        public notificationPreference: "email" | "whatsapp"
    ) {}
}





