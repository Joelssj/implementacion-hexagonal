import { Request, Response } from 'express';
import { CreateLeadUseCase } from '../../../application/CreateLeadAndSendTokenUseCase';


export class CreateLeadController {
    constructor(private readonly createLeadUseCase: CreateLeadUseCase) {}
  
    async run(req: Request, res: Response): Promise<Response> {
        const { first_Name, last_Name, correo, phone, notification_preference } = req.body;

        try {
            const lead = await this.createLeadUseCase.run({
                first_Name,
                last_Name,
                correo,
                phone,
                notification_preference // Pasamos la preferencia de notificación al caso de uso
            });
            return res.status(201).json({ message: 'Lead creado exitosamente', lead });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}



/*import { Request, Response } from 'express';
import { CreateLeadUseCase } from '../../../application/CreateLeadAndSendTokenUseCase';

export class CreateLeadController {
    constructor(private readonly createLeadUseCase: CreateLeadUseCase) {}
  
    async run(req: Request, res: Response): Promise<Response> {
        const { first_Name, last_Name, email, phone } = req.body;

        try {
            const lead = await this.createLeadUseCase.run({ first_Name, last_Name, email, phone });
            return res.status(201).json({ message: 'Lead creado exitosamente', lead });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
*/