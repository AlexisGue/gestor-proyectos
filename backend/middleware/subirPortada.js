import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { directorioUploads } from '../config/rutas.js';

// Directorio donde se guardarán las portadas.
const directorio = directorioUploads;

// Crear el directorio si todavía no existe.
if (!fs.existsSync(directorio)) {
    fs.mkdirSync(directorio, { recursive: true });
}

// Configuración del almacenamiento.
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, directorio);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const nombreUnico = `${Date.now()}-${crypto.randomUUID()}${extension}`;

        cb(null, nombreUnico);
    }
});

// Validación del tipo de imagen.
const validarImagen = (req, file, cb) => {
    const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];
    const extension = path.extname(file.originalname).toLowerCase();

    const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (
        extensionesPermitidas.includes(extension) &&
        tiposPermitidos.includes(file.mimetype)
    ) {
        return cb(null, true);
    }

    cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP.'));
};

// Configuración final de Multer.
const subirPortada = multer({
    storage: almacenamiento,
    fileFilter: validarImagen,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default subirPortada;
