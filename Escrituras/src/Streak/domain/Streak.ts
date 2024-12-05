export type DayStatus = 'completed' | 'protected' | 'failed';

export class Streak {
    constructor(
        public userUuid: string, // Identificador único del usuario
        public currentStreak: number, // Racha actual (modificable)
        public maxStreak: number, // Máxima racha lograda (modificable)
        public protectorsLeft: number, // Protectores restantes (modificable)
        public days: { date: string; status: DayStatus }[] // Historial de días
    ) {}
}
