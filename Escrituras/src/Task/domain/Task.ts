export type TaskType = 'Habito' | 'Temporal';
export type Priority = 'Baja' | 'Media' | 'Alta';
export type TaskStatus = 'activa' | 'terminada'; // Nuevo tipo para el estado

export class Task {
    constructor(
        public readonly id: string,
        public readonly userUuid: string,
        public readonly taskName: string,
        public readonly type: TaskType,
        public readonly priority: Priority,
        public readonly date: string,
        public readonly time: string,
        public status: TaskStatus = 'activa' // Estado predeterminado: "activa"
    ) {}
}
