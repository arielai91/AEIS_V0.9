import multer from 'multer';

const storage = multer.memoryStorage(); // Usar almacenamiento en memoria para procesar el archivo directamente
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // Tamaño máximo: 2 MB
    },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de imagen.'));
        }
        cb(null, true);
    },
});

export default upload;