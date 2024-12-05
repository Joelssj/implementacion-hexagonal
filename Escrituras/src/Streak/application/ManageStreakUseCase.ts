import { StreakRepository } from '../domain/StreakRepository';
import { TaskRepository } from '../../Task/domain/TaskRepository';
import { Streak } from '../domain/Streak'; 

export class ManageStreakUseCase {
    constructor(
        private streakRepository: StreakRepository,
        private taskRepository: TaskRepository
    ) {}

    async processDay(userUuid: string, date: string, useProtector: boolean): Promise<void> {
        console.log(`[ManageStreakUseCase] Iniciando proceso para userUuid: ${userUuid}, date: ${date}, useProtector: ${useProtector}`);
    
        const streak = await this.streakRepository.getStreakByUser(userUuid);
        if (!streak) {
            console.warn(`[ManageStreakUseCase] Racha no encontrada para userUuid: ${userUuid}`);
            throw new Error('Racha no encontrada');
        }
    
        console.log(`[ManageStreakUseCase] Racha encontrada:`, streak);
    
        const tasks = await this.taskRepository.getTasksByDate(userUuid, date);
        console.log(`[ManageStreakUseCase] Tareas para la fecha ${date}:`, tasks);
    
        const allCompleted = tasks.every((task) => task.status === 'terminada');
        console.log(`[ManageStreakUseCase] Todas las tareas completadas: ${allCompleted}`);
    
        if (allCompleted) {
            streak.currentStreak += 1;
            if (streak.currentStreak > streak.maxStreak) {
                streak.maxStreak = streak.currentStreak;
            }
            streak.days.push({ date, status: 'completed' });
            console.log(`[ManageStreakUseCase] Día completado para la racha.`);
        } else if (useProtector && streak.protectorsLeft > 0) {
            streak.protectorsLeft -= 1;
            streak.days.push({ date, status: 'protected' });
            console.log(`[ManageStreakUseCase] Día protegido.`);
        } else {
            streak.currentStreak = 0;
            streak.days.push({ date, status: 'failed' });
            console.log(`[ManageStreakUseCase] Día fallido, racha reiniciada.`);
        }
    
        await this.streakRepository.saveStreak(streak);
        console.log(`[ManageStreakUseCase] Racha actualizada y guardada.`);
    }
    
    async resetStreak(userUuid: string): Promise<void> {
        await this.streakRepository.resetStreak(userUuid);
    }

    async getStreak(userUuid: string): Promise<Streak | null> {
        console.log(`[ManageStreakUseCase] Buscando racha para userUuid: ${userUuid}`);
    
        const streak = await this.streakRepository.getStreakByUser(userUuid);
    
        if (!streak) {
            console.warn(`[ManageStreakUseCase] No se encontró racha para userUuid: ${userUuid}`);
        } else {
            console.log(`[ManageStreakUseCase] Racha encontrada para userUuid: ${userUuid}`, streak);
        }
    
        return streak;
    }
    
}
