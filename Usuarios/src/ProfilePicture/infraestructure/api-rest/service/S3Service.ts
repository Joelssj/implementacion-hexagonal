import dotenv from 'dotenv';
dotenv.config();

import AWS from 'aws-sdk';

export class S3Service {
    private readonly s3: AWS.S3;

    constructor() {
        // Verificar que las variables de entorno necesarias están configuradas
        console.log("Verificando variables de entorno para AWS:");
        console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID ? "Cargado correctamente" : "Falta en .env");
        console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "Cargado correctamente" : "Falta en .env");
        console.log("AWS_SESSION_TOKEN:", process.env.AWS_SESSION_TOKEN ? "Cargado correctamente" : "Falta en .env");
        console.log("AWS_REGION:", process.env.AWS_REGION || "Falta en .env");
        console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME || "Falta en .env");

        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN,
            region: process.env.AWS_REGION,
        });
    }

    async uploadProfilePicture(fileBuffer: Buffer, userUuid: string): Promise<string> {
        const fileKey = `${userUuid}/${Date.now()}-profile.jpg`;
    
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileKey,
            Body: fileBuffer,
            ContentType: "image/jpg", // o "image/png" según el tipo de imagen
            ContentDisposition: "inline"
        };
    
        console.log("Preparando para subir la imagen con los siguientes parámetros:");
        console.log("Bucket:", params.Bucket);
        console.log("File Key:", params.Key);
    
        try {
            const data = await this.s3.upload(params).promise();
            console.log("Imagen subida exitosamente a S3:", data.Location);
            return data.Location;
        } catch (error) {
            console.error("Error al subir la imagen a S3:", error);
            throw new Error("Error al subir la foto de perfil.");
        }
    }
    
}
