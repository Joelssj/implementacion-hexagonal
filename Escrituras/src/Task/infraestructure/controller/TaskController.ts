import { Request, Response } from 'express';
import { SaveTaskUseCase } from '../../application/SaveTaskUseCase';
import { Task } from '../../domain/Task';
import { v4 as uuidv4 } from 'uuid';


export class TaskController {
    constructor(private saveTaskUseCase: SaveTaskUseCase) {}

    async saveTask(req: Request, res: Response): Promise<Response> {
        const { userUuid, type, priority, date, time } = req.body;

        if (!userUuid || !type || !priority || !date || !time) {
            return res.status(400).json({ message: 'Faltan datos' });
        }

        const task = new Task(uuidv4(), userUuid, type, priority, date, time);
        await this.saveTaskUseCase.execute(task);

        return res.status(201).json({ message: 'Tarea guardada', task });
    }

    async updateTaskStatus(req: Request, res: Response): Promise<Response> {
        const { id } = req.params; // ID de la tarea
        const { status } = req.body; // Nuevo estado

        if (!id || !status || !['activa', 'terminada'].includes(status)) {
            return res.status(400).json({ message: 'Datos inválidos' });
        }

        await this.saveTaskUseCase['taskRepository'].updateStatus(id, status);
        return res.status(200).json({ message: `Estado de la tarea actualizado a ${status}` });
    }
}
