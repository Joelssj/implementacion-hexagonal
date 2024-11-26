import { TaskRepository } from '../../domain/TaskRepository';
import { Task } from '../../domain/Task';
import { getMongoDB } from '../../../database/DatabaseConnection';

export class MongoTaskRepository implements TaskRepository {
    private collection = getMongoDB().collection('tasks');

    // Método para guardar una nueva tarea
    async save(task: Task): Promise<void> {
        await this.collection.insertOne({
            id: task.id,
            userUuid: task.userUuid,
            type: task.type,
            priority: task.priority,
            date: task.date,
            time: task.time,
            status: task.status, // Guardamos el estado
        });
    }

    // Método para actualizar el estado de una tarea
    async updateStatus(id: string, status: 'activa' | 'terminada'): Promise<void> {
        await this.collection.updateOne(
            { id }, // Filtra por ID
            { $set: { status } } // Actualiza el estado
        );
    }

    // Método para obtener todas las tareas
    async getAll(): Promise<Task[]> {
        const tasks = await this.collection.find().toArray();
        return tasks.map(
            (doc: any) =>
                new Task(doc.id, doc.userUuid, doc.type, doc.priority, doc.date, doc.time, doc.status)
        );
    }

    // Método para obtener datos de la línea de tiempo
    async getTaskTimeline(): Promise<{ date: string; completed: number; delayed: number }[]> {
        const tasks = await this.collection.find().toArray(); // Obtiene todas las tareas

        // Mapa para contar tareas por fecha
        const timeline: Record<string, { completed: number; delayed: number }> = {};

        tasks.forEach((task) => {
            const date = task.date; // Fecha de la tarea
            const status = task.status; // Estado: "terminada" o "activa"

            // Inicializa la fecha si no existe en el mapa
            if (!timeline[date]) {
                timeline[date] = { completed: 0, delayed: 0 };
            }

            // Incrementa el contador según el estado
            if (status === 'terminada') {
                timeline[date].completed += 1;
            } else if (status === 'activa') {
                timeline[date].delayed += 1;
            }
        });

        // Convierte el mapa en un arreglo y lo ordena por fecha
        return Object.keys(timeline)
            .sort() // Ordena las fechas ascendentemente
            .map((date) => ({
                date,
                completed: timeline[date].completed,
                delayed: timeline[date].delayed,
            }));
    }
}
