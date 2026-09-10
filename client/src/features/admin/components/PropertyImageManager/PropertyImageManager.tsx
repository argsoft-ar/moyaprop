import React, { useState } from 'react';
import { Upload, Star, ArrowUp, ArrowDown, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import styles from './PropertyImageManager.module.css';

export interface PropertyImageItem {
  url: string;
  publicId: string;
  order: number;
  isCover: boolean;
}

export interface PropertyImageManagerProps {
  images: PropertyImageItem[];
  onChange: (images: PropertyImageItem[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const PropertyImageManager: React.FC<PropertyImageManagerProps> = ({
  images,
  onChange,
  onUploadingChange,
  disabled = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const setUploadingState = (uploading: boolean) => {
    setIsUploading(uploading);
    if (onUploadingChange) {
      onUploadingChange(uploading);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingState(true);
    setUploadError(null);

    try {
      const uploaded = await adminService.uploadImages(Array.from(files));
      const nextOrder = images.length;
      const newImgs = uploaded.map((img, idx) => ({
        url: img.url,
        publicId: img.publicId,
        order: nextOrder + idx,
        isCover: images.length === 0 && idx === 0
      }));
      onChange([...images, ...newImgs]);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Error al subir las imágenes');
    } finally {
      setUploadingState(false);
      e.target.value = '';
    }
  };

  const handleSetCover = (index: number) => {
    onChange(
      images.map((img, idx) => ({
        ...img,
        isCover: idx === index
      }))
    );
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const list = [...images];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
    onChange(list.map((item, idx) => ({ ...item, order: idx })));
  };

  const handleRemoveImage = (index: number) => {
    const filtered = images.filter((_, idx) => idx !== index);
    if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
      filtered[0].isCover = true;
    }
    onChange(filtered.map((item, idx) => ({ ...item, order: idx })));
  };

  return (
    <div className={`${styles.container} ${className}`.trim()}>
      {/* Zona de Carga Masiva */}
      <div className={styles.uploadZone}>
        <input
          type="file"
          id="imageUpload"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading || disabled}
          className={styles.fileInput}
        />
        <label htmlFor="imageUpload" className={styles.uploadLabel}>
          <Upload size={32} className={styles.uploadIcon} />
          <span className={styles.uploadText}>
            {isUploading
              ? 'Subiendo imágenes a Cloudinary...'
              : 'Haz clic para seleccionar o arrastra fotos aquí'}
          </span>
          <span className={styles.uploadSubtext}>
            Formatos admitidos: JPG, PNG, WEBP (Hasta 20 imágenes)
          </span>
        </label>
      </div>

      {uploadError && <p className={styles.uploadError}>{uploadError}</p>}

      {/* Grilla de Miniaturas y Reordenamiento */}
      {images.length > 0 && (
        <div className={styles.imageGrid}>
          {images.map((img, index) => (
            <div
              key={img.publicId || index}
              className={`${styles.imageCard} ${
                img.isCover ? styles.isCoverCard : ''
              }`}
            >
              <img
                src={img.url}
                alt={`Foto ${index + 1}`}
                className={styles.imagePreview}
              />

              {img.isCover && <span className={styles.coverBadge}>⭐ Portada</span>}

              <div className={styles.imageActions}>
                <button
                  type="button"
                  onClick={() => handleSetCover(index)}
                  className={`${styles.imgBtn} ${
                    img.isCover ? styles.activeCoverBtn : ''
                  }`}
                  title="Definir como foto de portada"
                >
                  <Star size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveImage(index, 'up')}
                  disabled={index === 0}
                  className={styles.imgBtn}
                  title="Mover hacia la izquierda"
                >
                  <ArrowUp size={14} style={{ transform: 'rotate(-90deg)' }} />
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  className={styles.imgBtn}
                  title="Mover hacia la derecha"
                >
                  <ArrowDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className={`${styles.imgBtn} ${styles.deleteImgBtn}`}
                  title="Eliminar fotografía"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
