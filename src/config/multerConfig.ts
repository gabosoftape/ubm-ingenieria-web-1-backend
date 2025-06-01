import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Directorio de almacenamiento
const storageDir = path.join(__dirname, '../storage');

if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

// Configuración de multer para guardar archivos en la carpeta storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, storageDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

export default upload;