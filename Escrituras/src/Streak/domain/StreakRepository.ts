import { Streak } from './Streak';

export interface StreakRepository {
    getStreakByUser(userUuid: string): Promise<Streak | null>;
    saveStreak(streak: Streak): Promise<void>;
    resetStreak(userUuid: string): Promise<void>;
    getAllUsers(): Promise<{ userUuid: string }[]>; // Para obtener todos los usuarios
}
