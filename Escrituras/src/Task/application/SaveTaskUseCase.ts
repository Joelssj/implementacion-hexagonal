import { Task } from '../domain/Task';
import { TaskRepository } from '../domain/TaskRepository';
export class SaveTaskUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(task: Task): Promise<void> {
        await this.taskRepository.save(task);
    }
}
