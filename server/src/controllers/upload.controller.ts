import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service.js';
import { env } from '../config/env.js';

import fs from 'fs';
import path from 'path';

export class UploadController {
  static async uploadImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No se enviaron archivos para subir'
        });
        return;
      }

      // Si no están configuradas las credenciales de Cloudinary, guardar físicamente en disco local
      if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const host = req.get('host') || `localhost:${env.PORT}`;
        const protocol = req.protocol;

        const localResults = files.map((file, idx) => {
          const ext = path.extname(file.originalname) || '.jpg';
          const filename = `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
          const filePath = path.join(uploadDir, filename);

          fs.writeFileSync(filePath, file.buffer);

          return {
            url: `${protocol}://${host}/uploads/${filename}`,
            publicId: `local_${filename}`,
            order: idx,
            isCover: idx === 0
          };
        });

        res.status(200).json({
          success: true,
          message: `${localResults.length} imagen(es) guardada(s) localmente`,
          data: localResults
        });
        return;
      }

      // Si Cloudinary está configurado, subir a la nube
      const uploadPromises = files.map((file, index) =>
        UploadService.uploadImage(file.buffer).then((res) => ({
          url: res.url,
          publicId: res.publicId,
          order: index,
          isCover: index === 0
        }))
      );

      const results = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        message: `${results.length} imagen(es) subida(s) con éxito a Cloudinary`,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;

      if (publicId.startsWith('local_')) {
        const filename = publicId.replace('local_', '');
        const filePath = path.join(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        res.status(200).json({
          success: true,
          message: 'Imagen local eliminada'
        });
        return;
      }

      await UploadService.deleteImage(publicId);
      res.status(200).json({
        success: true,
        message: 'Imagen eliminada de Cloudinary'
      });
    } catch (error) {
      next(error);
    }
  }
}
