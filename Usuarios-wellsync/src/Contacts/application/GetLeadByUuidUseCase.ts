import { LeadsRepository } from "../../Contacts/domain/LeadsRepository";
import { Lead } from "../../Contacts/domain/Lead";

export class GetLeadByUuidUseCase {
    constructor(private readonly leadsRepository: LeadsRepository) {}

    async run(uuid: string): Promise<Lead | null> {
        const lead = await this.leadsRepository.getLeadByUuid(uuid);
        if (!lead) {
            throw new Error("Lead no encontrado");
        }
        return lead;
    }
}
