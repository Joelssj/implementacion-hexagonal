import { Request, Response } from 'express';
import { SaveTaskUseCase } from '../../application/SaveTaskUseCase';
import { Task } from '../../domain/Task';
import { v4 as uuidv4 } from 'uuid';

export class TaskController {
    constructor(private saveTaskUseCase: SaveTaskUseCase) {}

    async saveTask(req: Request, res: Response): Promise<Response> {
        const { userUuid, taskName, type, priority, date, time } = req.body;

        if (!userUuid || !taskName || !type || !priority || !date || !time) {
            return res.status(400).json({ message: 'Faltan datos' });
        }

        try {
            const task = new Task(uuidv4(), userUuid, taskName, type, priority, date, time);
            await this.saveTaskUseCase.execute(task);

            return res.status(201).json({ message: 'Tarea guardada', task });
        } catch (error) {
            return res.status(500).json({ message: 'Error al guardar la tarea', error: error });
        }
    }

    async updateTaskStatus(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || !status || !['activa', 'terminada'].includes(status)) {
            return res.status(400).json({ message: 'Datos inválidos' });
        }

        try {
            await this.saveTaskUseCase['taskRepository'].updateStatus(id, status);

            return res.status(200).json({ message: `Estado de la tarea actualizado a ${status}` });
        } catch (error) {
            return res.status(500).json({ message: 'Error al actualizar el estado de la tarea', error: error });
        }
    }
}





