import { TaskRepository } from '../domain/TaskRepository';
import { Task } from '../domain/Task';

export class GetAllTasksUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(): Promise<Task[]> {
        return await this.taskRepository.getAll();
    }
}
