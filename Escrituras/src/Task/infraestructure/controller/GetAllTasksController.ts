import { Request, Response } from 'express';
import { GetAllTasksUseCase } from '../../application/GetAllTasksUseCase';

export class GetAllTasksController {
    constructor(private getAllTasksUseCase: GetAllTasksUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            // Llama al caso de uso para obtener todas las tareas
            const tasks = await this.getAllTasksUseCase.execute();

            // Devuelve las tareas en formato JSON
            return res.status(200).json(tasks);
        } catch (error) {
            console.error('Error al obtener todas las tareas:', error);

            // Devuelve un error 500 si algo falla
            return res.status(500).json({ message: 'Error al obtener las tareas' });
        }
    }
}
