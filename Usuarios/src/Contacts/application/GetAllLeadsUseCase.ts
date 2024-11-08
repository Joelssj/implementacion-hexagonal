import { LeadsRepository } from "../domain/LeadsRepository";
import { Lead } from "../domain/Lead";

export class GetAllLeadsUseCase {
    constructor(private readonly leadsRepository: LeadsRepository) {}

    async run(): Promise<Lead[]> {
        return this.leadsRepository.getAllLeads();
    }
}
