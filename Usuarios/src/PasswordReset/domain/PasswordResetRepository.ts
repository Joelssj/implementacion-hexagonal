import { PasswordReset } from "./PasswordReset";

export interface PasswordResetRepository {
    savePasswordReset(passwordReset: PasswordReset): Promise<void>;
    getPasswordResetByToken(token: string): Promise<PasswordReset | null>;
    deletePasswordReset(token: string): Promise<void>;
}
