import { TaskRepository } from '../domain/TaskRepository';

export class GetTaskTimelineUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(): Promise<{ date: string; completed: number; delayed: number }[]> {
        // Llama al repositorio para obtener los datos
        return await this.taskRepository.getTaskTimeline();
    }
}
