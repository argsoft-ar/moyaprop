import React from 'react';
import { Property } from '../../../../types/property.types';
import { PropertyCard } from '../PropertyCard/PropertyCard';
import { Spinner, EmptyState } from '../../../../components/ui';
import { Home, AlertCircle } from 'lucide-react';
import styles from './PropertyGrid.module.css';

interface PropertyGridProps {
  properties: Property[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  isLoading,
  error,
  onRetry,
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

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle size={36} />}
        title="No se pudieron conectar las propiedades"
        description={error}
        actionLabel={onRetry ? 'Reintentar conexión' : undefined}
        onAction={onRetry}
      />
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
