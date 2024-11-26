export class PasswordReset {
    constructor(
        public correo: string,
        public token: string,
        public createdAt: Date,
        public expiresAt: Date
    ) {}
}
