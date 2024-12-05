// AuditLog.ts
export class AuditLog {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly actionType: string,
        public readonly details: string,
        public readonly timestamp: Date
    ) {}
}
