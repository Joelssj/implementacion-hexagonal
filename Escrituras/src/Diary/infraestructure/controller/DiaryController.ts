import { Request, Response } from 'express';
import { SaveDiaryUseCase } from '../../application/SaveDiaryUseCase';
import { Diary } from '../../domain/Diary';
import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from '../services/S3Client';


export class DiaryController {
    constructor(private saveDiaryUseCase: SaveDiaryUseCase) {}

    async saveDiary(req: Request, res: Response): Promise<Response> {
        const { userUuid, comment, date, time } = req.body;

        // Verifica que el archivo haya sido procesado correctamente
        if (!userUuid || !req.file || !comment || !date || !time) {
            return res.status(400).json({ message: 'Faltan datos' });
        }

        try {
            // Procesa la imagen y súbela al bucket
            const fileContent = req.file.buffer; // Contenido del archivo desde multer
            const fileName = `diaries/${uuidv4()}_${req.file.originalname}`; // Nombre único del archivo
            const bucketName = process.env.AWS_BUCKET_NAME; // Bucket desde las variables de entorno

            if (!bucketName) {
                throw new Error('El nombre del bucket no está configurado en las variables de entorno');
            }

            const imageUrl = await uploadToS3(fileContent, fileName, bucketName);

            // Crea la entrada del diario con la URL de la imagen
            const diary = new Diary(uuidv4(), userUuid, imageUrl, comment, date, time);
            await this.saveDiaryUseCase.execute(diary);

            return res.status(201).json({ message: 'Diario guardado', diary });
        } catch (error) {
            console.error('Error al guardar el diario:', error);
            return res.status(500).json({ message: 'Error al guardar el diario', error: error });
        }
    }
}

