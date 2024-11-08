import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailAdapter {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '465', 10),
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                text,
            });
            console.log(`✔️ Correo enviado a ${to}`);
        } catch (error) {
            console.error('❌ Error al enviar el correo:', error);
            throw new Error('No se pudo enviar el correo.');
        }
    }
}



/*import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailAdapter {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '465', 10),
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD, 
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                text,
            });
            console.log(`Correo enviado a ${to}`);
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            throw new Error('No se pudo enviar el correo.');
        }
    }
}

*/