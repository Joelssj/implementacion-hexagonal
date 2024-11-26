import { Request, Response } from 'express';
import { GetAllDiariesUseCase } from '../../application/GetAllDiariesUseCase';


export class GetAllDiariesController {
    constructor(private getAllDiariesUseCase: GetAllDiariesUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            // Llama al caso de uso para obtener todos los diarios
            const diaries = await this.getAllDiariesUseCase.execute();
            return res.status(200).json(diaries); // Devuelve la respuesta al cliente
        } catch (error) {
            console.error('Error al obtener los diarios:', error);
            return res.status(500).json({ message: 'Error al obtener los diarios' });
        }
    }
}
