import { TaskRepository } from '../domain/TaskRepository';

export class GetTaskTimelineUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(): Promise<
        {
            date: string;
            taskName: string;
            priority: 'Baja' | 'Media' | 'Alta';
            type: 'Habito' | 'Temporal';
            completed: boolean;
            userUuid: string;  // Añadido el userUuid
        }[]
    > {
        // Llama al repositorio para obtener los datos y los incluye en el resultado
        const tasks = await this.taskRepository.getTaskTimeline();

        // Aquí, si es necesario, puedes agregar el userUuid de alguna manera
        return tasks.map(task => ({
            date: task.date,
            taskName: task.taskName,
            priority: task.priority,
            type: task.type,
            completed: task.completed,
            userUuid: task.userUuid // Asegúrate de que el repositorio devuelve esto correctamente
        }));
    }
}













