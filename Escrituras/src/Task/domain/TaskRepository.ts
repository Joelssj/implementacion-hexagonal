import { Task } from './Task';

export interface TaskRepository {
    updateStatus(id: string, status: any): unknown;
    save(task: Task): Promise<void>;
    getAll(): Promise<Task[]>;
    getTaskTimeline(): Promise<{ date: string; completed: number; delayed: number }[]>;
}
