import AWS from 'aws-sdk';
import 'dotenv/config';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN, // Incluye el token si es necesario
    region: process.env.AWS_REGION, // Región de AWS donde está el bucket
});

export const uploadToS3 = async (
    fileContent: Buffer, // Contenido del archivo
    fileName: string, // Nombre del archivo
    bucketName: string
): Promise<string> => {
    const params = {
        Bucket: bucketName,
        Key: fileName, // Nombre del archivo en el bucket
        Body: fileContent, // Contenido del archivo
        ContentType: 'image/jpeg', // Asegura el tipo de contenido (ajusta si es necesario)
    };

    const data = await s3.upload(params).promise(); // Subida a S3
    return data.Location; // Retorna la URL del archivo
};

