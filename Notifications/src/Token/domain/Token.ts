// Token.ts
export class Token {
    constructor(
        public uuid: string,
        public userUuid: string,
        public token: string,
        public expiresAt: Date,
        public isActive: boolean = true, // Campo para indicar si el token está activo o no
    ) {}
}


/*
export class Token {
    constructor(
        public uuid: string,
        public userUuid: string,
        public token: string,
        public expiresAt: Date
    ) {}
}
*/