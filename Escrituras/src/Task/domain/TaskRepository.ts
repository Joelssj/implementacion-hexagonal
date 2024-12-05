import { Task } from './Task';

export interface TaskRepository {
    /**
     * Actualiza el estado de una tarea.
     * @param id - ID de la tarea.
     * @param status - Nuevo estado de la tarea ('activa' | 'terminada').
     */
    updateStatus(id: string, status: 'activa' | 'terminada'): Promise<void>;

    /**
     * Guarda una nueva tarea.
     * @param task - Objeto de tipo Task.
     */
    save(task: Task): Promise<void>;

    /**
     * Obtiene todas las tareas.
     * @returns Una lista de objetos de tipo Task.
     */
    getAll(): Promise<Task[]>;

    /**
     * Obtiene una lista de tareas con fecha, nombre, prioridad, tipo y estado.
     * @returns Un arreglo con la información básica de las tareas.
     */
    getTaskTimeline(): Promise<
        {
            userUuid: string;
            date: string;
            taskName: string;
            priority: 'Baja' | 'Media' | 'Alta';
            type: 'Habito' | 'Temporal';
            completed: boolean;

        }[]
    >;

    /**
     * Obtiene todas las tareas de un usuario en una fecha específica.
     * @param userUuid - Identificador único del usuario.
     * @param date - Fecha para filtrar las tareas.
     * @returns Un arreglo de objetos de tipo Task.
     */
    getTasksByDate(userUuid: string, date: string): Promise<Task[]>;
    getTaskById(id: string): Promise<Task | null>;
    getTasksByCompletionStatus(userUuid: string, completed: boolean): Promise<Task[]>;
    /*getTasksByCompletionStatus(userUuid: string, completed: boolean[]): Promise<{ 
        [key: string]: { date: string; completed: number; notCompleted: number; };
    }>;*/
    
}





