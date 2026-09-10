import React from 'react';
import { Maximize2, BedDouble, Bath, Car, Calendar } from 'lucide-react';
import { Property } from '../../../../types/property.types';
import { formatArea, formatDate } from '../../../../utils/formatters';
import styles from './PropertySpecs.module.css';

export interface PropertySpecsProps {
  property: Property;
  title?: string;
  className?: string;
}

export const PropertySpecs: React.FC<PropertySpecsProps> = ({
  property,
  title = 'Características Principales',
  className = ''
}) => {
  return (
    <div className={`${styles.specsBox} ${className}`.trim()}>
      <h3 className={styles.boxTitle}>{title}</h3>
      <div className={styles.specsGrid}>
        <div className={styles.specItem}>
          <Maximize2 size={20} className={styles.specIcon} />
          <div className={styles.specTexts}>
            <span className={styles.specLabel}>Sup. Total</span>
            <span className={styles.specVal}>{formatArea(property.totalArea)}</span>
          </div>
        </div>

        <div className={styles.specItem}>
          <Maximize2 size={20} className={styles.specIcon} />
          <div className={styles.specTexts}>
            <span className={styles.specLabel}>Sup. Cubierta</span>
            <span className={styles.specVal}>{formatArea(property.coveredArea)}</span>
          </div>
        </div>

        <div className={styles.specItem}>
          <BedDouble size={20} className={styles.specIcon} />
          <div className={styles.specTexts}>
            <span className={styles.specLabel}>Habitaciones</span>
            <span className={styles.specVal}>{property.bedrooms}</span>
          </div>
        </div>

        <div className={styles.specItem}>
          <Bath size={20} className={styles.specIcon} />
          <div className={styles.specTexts}>
            <span className={styles.specLabel}>Baños</span>
            <span className={styles.specVal}>{property.bathrooms}</span>
          </div>
        </div>

        <div className={styles.specItem}>
          <Car size={20} className={styles.specIcon} />
          <div className={styles.specTexts}>
            <span className={styles.specLabel}>Cocheras</span>
            <span className={styles.specVal}>{property.garages}</span>
          </div>
        </div>

        <div className={styles.specItem}>
          <Calendar size={20} className={styles.specIcon} />
          <div className={styles.specTexts}>
            <span className={styles.specLabel}>Publicado</span>
            <span className={styles.specVal}>{formatDate(property.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
