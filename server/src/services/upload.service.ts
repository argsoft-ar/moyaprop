import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary.js';

export class UploadService {
  static async uploadImage(fileBuffer: Buffer, folder: string = 'moyaprop/properties'): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' }, // Compresión inteligente y formato WebP automático
            { width: 1920, height: 1080, crop: 'limit' } // Máximo tamaño razonable
          ]
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(error || new Error('Error al procesar la imagen en Cloudinary'));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.warn(`[WARN] No se pudo eliminar la imagen ${publicId} de Cloudinary:`, error);
    }
  }
}
