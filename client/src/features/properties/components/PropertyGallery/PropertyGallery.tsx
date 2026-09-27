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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className={styles.emptyGallery}>
        <ImageIcon size={48} />
        <p>No hay fotografías disponibles para esta publicación</p>
      </div>
    );
  }

  const activeImage = images[currentIndex];

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Soporte para gestos táctiles (Swipe) en mobile
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div className={styles.container}>
      {/* Visor Principal con Soporte Táctil */}
      <div
        className={styles.mainViewer}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={activeImage.url}
          alt={`${title} - Foto ${currentIndex + 1}`}
          className={styles.mainImage}
          loading="eager"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrev}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
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
