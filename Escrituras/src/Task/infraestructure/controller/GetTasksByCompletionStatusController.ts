import { Request, Response } from 'express';
import { GetTasksByCompletionStatusUseCase } from '../../application/GetTasksByCompletionStatusUseCase';


export class GetTasksByCompletionStatusController {
    constructor(private getTasksByCompletionStatusUseCase: GetTasksByCompletionStatusUseCase) {}

    // Método para manejar la solicitud y pasar el userUuid como parámetro
    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { userUuid } = req.params; // Obtenemos el userUuid desde los parámetros de la ruta

            if (!userUuid) {
                return res.status(400).json({ message: 'El parámetro userUuid es obligatorio' });
            }

            // Aquí puedes usar 'userUuid' para ejecutar el caso de uso
            const result = await this.getTasksByCompletionStatusUseCase.execute(userUuid);

            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener las tareas', error });
        }
    }
}



