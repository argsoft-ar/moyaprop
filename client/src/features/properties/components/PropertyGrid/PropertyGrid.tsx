import React from 'react';
import { Property } from '../../../../types/property.types';
import { PropertyCard } from '../PropertyCard/PropertyCard';
import { Spinner, EmptyState } from '../../../../components/ui';
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
      <EmptyState
        icon={<Home size={36} />}
        title="No se encontraron propiedades"
        description="Prueba ajustando los filtros de búsqueda o explorando otras localidades."
        actionLabel={onClearFilters ? 'Limpiar todos los filtros' : undefined}
        onAction={onClearFilters}
      />
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
