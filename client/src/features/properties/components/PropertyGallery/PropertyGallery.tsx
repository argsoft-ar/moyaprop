import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { PropertyImage } from '../../../../types/property.types';
import styles from './PropertyGallery.module.css';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.emptyGallery}>
        <ImageIcon size={48} />
        <p>No hay fotografías disponibles para esta publicación</p>
      </div>
    );
  }

  const activeImage = images[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.container}>
      {/* Visor Principal */}
      <div className={styles.mainViewer}>
        <img
          src={activeImage.url}
          alt={`${title} - Foto ${currentIndex + 1}`}
          className={styles.mainImage}
        />

        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrev}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              aria-label="Foto siguiente"
            >
              <ChevronRight size={24} />
            </button>

            <span className={styles.counter}>
              {currentIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Tira de Miniaturas */}
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, index) => (
            <button
              key={img.id || index}
              className={`${styles.thumbnailButton} ${index === currentIndex ? styles.activeThumbnail : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ver foto ${index + 1}`}
            >
              <img src={img.url} alt={`Miniatura ${index + 1}`} className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
