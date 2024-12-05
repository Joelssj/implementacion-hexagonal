import { v4 as uuidv4, validate as validateUuid } from 'uuid';

export class Lead {
    constructor(
        public uuid: string = uuidv4(),
        public first_Name: string,
        public last_Name: string,
        public correo: string,
        public phone: string,
        public notificationPreference: "email" | "whatsapp"
    ) {
        if (!validateUuid(this.uuid)) {
            throw new Error("Invalid UUID");
        }
    }
}







