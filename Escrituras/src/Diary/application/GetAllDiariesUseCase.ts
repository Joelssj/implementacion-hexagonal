import { DiaryRepository } from '../domain/DiaryRepository';
import { Diary } from '../domain/Diary';

export class GetAllDiariesUseCase {
    constructor(private diaryRepository: DiaryRepository) {}

    async execute(): Promise<Diary[]> {
        return await this.diaryRepository.getAll(); // Llama al repositorio
    }
}
