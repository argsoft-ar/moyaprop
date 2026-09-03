import React from 'react';
import { Property } from '../../../../types/property.types';
import { PropertyCard } from '../PropertyCard/PropertyCard';
import { Spinner } from '../../../../components/ui/Spinner';
import { Home } from 'lucide-react';
import styles from './PropertyGrid.module.css';

interface PropertyGridProps {
  properties: Property[];
  isLoading: boolean;
  onClearFilters?: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  isLoading,
  onClearFilters
}) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" />
        <p className={styles.loadingText}>Cargando propiedades disponibles...</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <Home size={36} />
        </div>
        <h3 className={styles.emptyTitle}>No se encontraron propiedades</h3>
        <p className={styles.emptySubtitle}>
          Prueba ajustando los filtros de búsqueda o explorando otras localidades.
        </p>
        {onClearFilters && (
          <button className={styles.clearButton} onClick={onClearFilters}>
            Limpiar todos los filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
