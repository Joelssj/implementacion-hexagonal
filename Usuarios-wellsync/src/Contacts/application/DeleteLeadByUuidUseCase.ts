import { LeadsRepository } from "../../Contacts/domain/LeadsRepository";

export class DeleteLeadByUuidUseCase {
    constructor(private readonly leadsRepository: LeadsRepository) {}

    async run(uuid: string): Promise<void> {
        const lead = await this.leadsRepository.getLeadByUuid(uuid);
        if (!lead) {
            throw new Error("Lead no encontrado");
        }
        await this.leadsRepository.deleteLeadByUuid(uuid);
    }
}
