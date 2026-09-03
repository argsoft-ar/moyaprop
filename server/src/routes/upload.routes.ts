import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Configuración de multer en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo por archivo
    files: 20 // Hasta 20 archivos simultáneos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, WEBP, etc.)'));
    }
  }
});

// Subir múltiples imágenes (privado)
router.post(
  '/',
  authenticateToken as any,
  upload.array('images', 20),
  UploadController.uploadImages
);

// Borrar imagen por publicId (privado)
router.delete(
  '/:publicId',
  authenticateToken as any,
  UploadController.deleteImage
);

export default router;
