import { Lead } from "./Lead";

export interface LeadsRepository {
    saveLead(lead: Lead): Promise<void>;
    getLeadByUuid(uuid: string): Promise<Lead | null>;
    deleteLeadByUuid(uuid: string): Promise<void>;
    getByEmail(correo: string): Promise<Lead | null>; // Nuevo método agregado
    updateLead(lead: Lead): Promise<void>; 
    getByPhone(phone: string): Promise<Lead | null>;
    getAllLeads(): Promise<Lead[]>;
}

