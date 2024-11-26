import multer from 'multer';

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage(); // Guarda el archivo en memoria temporalmente

// Configurar Multer para manejar un solo archivo con la clave 'image'
export const uploadSingleImage = multer({ storage }).single('image');
