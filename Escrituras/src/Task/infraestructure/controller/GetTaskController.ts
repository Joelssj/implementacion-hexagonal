import { Request, Response } from 'express';
import { GetTaskTimelineUseCase } from '../../application/GetTaskTimelineUseCase';


export class GetTaskTimelineController {
    constructor(private getTaskTimelineUseCase: GetTaskTimelineUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            // Llama al caso de uso para obtener los datos
            const timeline = await this.getTaskTimelineUseCase.execute();
            return res.status(200).json(timeline); // Enviar datos al cliente
        } catch (error) {
            console.error('Error al obtener la línea de tiempo de tareas:', error);
            return res.status(500).json({ message: 'Error al obtener datos de la gráfica' });
        }
    }
}
