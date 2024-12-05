import { Request, Response } from 'express';
import { ManageStreakUseCase } from '../../application/ManageStreakUseCase';

export class StreakController {
    constructor(private manageStreakUseCase: ManageStreakUseCase) {}

    async getStreak(req: Request, res: Response): Promise<Response> {
        const { userUuid } = req.params;
    
        console.log(`[StreakController] Iniciando búsqueda de racha para userUuid: ${userUuid}`);
    
        if (!userUuid) {
            console.error(`[StreakController] userUuid no proporcionado`);
            return res.status(400).json({ message: 'Falta el identificador del usuario' });
        }
    
        try {
            const streak = await this.manageStreakUseCase.getStreak(userUuid);
    
            if (!streak) {
                console.warn(`[StreakController] Racha no encontrada para userUuid: ${userUuid}`);
                return res.status(404).json({ message: 'Racha no encontrada' });
            }
    
            console.log(`[StreakController] Racha encontrada para userUuid: ${userUuid}`, streak);
            return res.status(200).json(streak);
        } catch (error) {
            console.error(`[StreakController] Error al obtener la racha para userUuid: ${userUuid}`, error);
            return res.status(500).json({ message: 'Error al obtener la racha', error: error });
        }
    }
    
    

    async processDay(req: Request, res: Response): Promise<Response> {
        const { userUuid } = req.params;
        const { date, useProtector } = req.body;
    
        console.log(`[StreakController] Procesando racha para userUuid: ${userUuid}, date: ${date}, useProtector: ${useProtector}`);
    
        if (!userUuid || !date) {
            console.error(`[StreakController] Faltan datos requeridos: userUuid o date`);
            return res.status(400).json({ message: 'Faltan datos requeridos: userUuid o date' });
        }
    
        try {
            await this.manageStreakUseCase.processDay(userUuid, date, useProtector || false);
    
            console.log(`[StreakController] Racha procesada correctamente para userUuid: ${userUuid}, date: ${date}`);
            return res.status(200).json({ message: 'Racha procesada correctamente' });
        } catch (error) {
            console.error(`[StreakController] Error al procesar la racha para userUuid: ${userUuid}, date: ${date}`, error);
            return res.status(500).json({ message: 'Error al procesar la racha', error });
        }
    }
    

    async resetStreak(req: Request, res: Response): Promise<Response> {
        const { userUuid } = req.params;

        if (!userUuid) {
            return res.status(400).json({ message: 'Falta el identificador del usuario' });
        }

        try {
            await this.manageStreakUseCase.resetStreak(userUuid);

            return res.status(200).json({ message: 'Racha reiniciada correctamente' });
        } catch (error) {
            return res.status(500).json({ message: 'Error al reiniciar la racha', error: error });
        }
    }
}
