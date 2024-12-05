import { TaskRepository } from '../../domain/TaskRepository';
import { Task } from '../../domain/Task';
import { getMongoDB } from '../../../database/DatabaseConnection';
import { WithId, Document } from 'mongodb';

const daysOfWeekInSpanish = [
    'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'
];

export class MongoTaskRepository implements TaskRepository {
    private collection = getMongoDB().collection('tasks');

    // Método para guardar una nueva tarea
    async save(task: Task): Promise<void> {
        await this.collection.insertOne({
            id: task.id,
            userUuid: task.userUuid,
            taskName: task.taskName,
            type: task.type,
            priority: task.priority,
            date: task.date,
            time: task.time,
            status: task.status,
        });
    }

    // Método para obtener la línea de tiempo de tareas (fecha, nombre, prioridad, tipo, completada)
    async getTaskTimeline(): Promise<{
        userUuid: string;
        date: string;
        taskName: string;
        priority: 'Baja' | 'Media' | 'Alta';
        type: 'Habito' | 'Temporal';
        completed: boolean;
    }[]> {
        // Obtener todas las tareas
        const tasks: WithId<Document>[] = await this.collection.find().toArray();
        
        // Mapear los resultados de MongoDB a la estructura deseada
        return tasks.map(task => ({
            userUuid: task.userUuid,
            date: task.date,
            taskName: task.taskName,
            priority: task.priority,
            type: task.type,
            completed: task.status === 'terminada', // Consideramos que "terminada" indica tarea completada
        }));
    }

    // Método para obtener tareas por estado de completado para la semana anterior



    // Método para obtener todas las tareas de un usuario








    /*
    async getAll(): Promise<Task[]> {
        const tasks = await this.collection.find().toArray();
        return tasks.map(task => new Task(
            task.id,
            task.userUuid,
            task.taskName,
            task.type,
            task.priority,
            task.date,
            task.time,
            task.status
        ));
    }*/

        async getAll(): Promise<Task[]> {
            const tasks = await this.collection
                .find()
                .sort({ date: 1 }) // Ordenar de forma ascendente por la fecha (1 para ascendente, -1 para descendente)
                .toArray();
        
            return tasks.map(task => new Task(
                task.id,
                task.userUuid,
                task.taskName,
                task.type,
                task.priority,
                task.date,
                task.time,
                task.status
            ));
        }
        








    // Método para obtener una tarea por ID
    async getTaskById(id: string): Promise<Task | null> {
        const doc = await this.collection.findOne({ id });
        if (!doc) return null;

        return new Task(
            doc.id,
            doc.userUuid,
            doc.taskName,
            doc.type,
            doc.priority,
            doc.date,
            doc.time,
            doc.status
        );
    }

    // Método para actualizar el estado de una tarea
    async updateStatus(id: string, status: 'activa' | 'terminada'): Promise<void> {
        await this.collection.updateOne(
            { id },
            { $set: { status } }
        );
    }

    // Método para obtener tareas por fecha
    async getTasksByDate(userUuid: string, date: string): Promise<Task[]> {
        const tasks = await this.collection.find({ userUuid, date }).toArray();
        return tasks.map(task => new Task(
            task.id,
            task.userUuid,
            task.taskName,
            task.type,
            task.priority,
            task.date,
            task.time,
            task.status
        ));
    }







   async getTasksByCompletionStatus(userUuid: string, completed: boolean): Promise<Task[]> {
        // Filtramos las tareas según el estado completado/no completado
        const tasks = await this.collection.find({
            userUuid,
            status: completed ? 'terminada' : 'activa',
        }).toArray();

        // Devolvemos las tareas mapeadas al tipo Task
        return tasks.map(
            (doc: any) =>
                new Task(
                    doc.id,
                    doc.userUuid,
                    doc.taskName,
                    doc.type,
                    doc.priority,
                    doc.date,
                    doc.time,
                    doc.status
                )
        );
    }
}





