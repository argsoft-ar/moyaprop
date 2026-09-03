import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service.js';
import { env } from '../config/env.js';

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

      // Si no están configuradas las credenciales de Cloudinary (por ejemplo, en desarrollo inicial)
      if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY) {
        const mockResults = files.map((file, idx) => ({
          url: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80`,
          publicId: `mock_${Date.now()}_${idx}`,
          order: idx,
          isCover: idx === 0
        }));

        res.status(200).json({
          success: true,
          message: 'Imágenes procesadas (Modo Simulación / Dev)',
          data: mockResults
        });
        return;
      }

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
        message: `${results.length} imagen(es) subida(s) con éxito`,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId as string;
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
