import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { PropertyFilters as FilterType, OperationType, PropertyType } from '../../../../types/property.types';
import styles from './PropertyFilters.module.css';

interface PropertyFiltersProps {
  filters: FilterType;
  onChange: (newFilters: FilterType) => void;
  onReset: () => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onChange,
  onReset
}) => {
  const handleOperationChange = (op?: OperationType) => {
    onChange({ ...filters, operationType: op, page: 1 });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as PropertyType;
    onChange({ ...filters, propertyType: val ? val : undefined, page: 1 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value || undefined, page: 1 });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, city: e.target.value || undefined, page: 1 });
  };

  const isFiltered = Boolean(
    filters.operationType ||
    filters.propertyType ||
    filters.search ||
    filters.city ||
    filters.minPrice ||
    filters.maxPrice
  );

  return (
    <div className={styles.container}>
      {/* Selector de Operación Superior (Tabs) */}
      <div className={styles.tabsRow}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${!filters.operationType ? styles.activeTab : ''}`}
            onClick={() => handleOperationChange(undefined)}
          >
            Todas
          </button>
          <button
            type="button"
            className={`${styles.tab} ${filters.operationType === 'VENTA' ? styles.activeTab : ''}`}
            onClick={() => handleOperationChange('VENTA')}
          >
            Comprar
          </button>
          <button
            type="button"
            className={`${styles.tab} ${filters.operationType === 'ALQUILER' ? styles.activeTab : ''}`}
            onClick={() => handleOperationChange('ALQUILER')}
          >
            Alquilar
          </button>
        </div>

        {isFiltered && (
          <button type="button" className={styles.resetButton} onClick={onReset} title="Restablecer filtros">
            <RotateCcw size={15} />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Barra de Filtros Integrados */}
      <div className={styles.filterBar}>
        {/* Búsqueda textual */}
        <div className={styles.searchField}>
          <Search size={18} className={styles.fieldIcon} />
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className={styles.input}
          />
        </div>

        {/* Localidad */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Localidad o zona..."
            value={filters.city || ''}
            onChange={handleCityChange}
            className={styles.input}
          />
        </div>

        {/* Tipo de Inmueble */}
        <div className={styles.selectGroup}>
          <select
            value={filters.propertyType || ''}
            onChange={handleTypeChange}
            className={styles.select}
          >
            <option value="">Tipo de Inmueble (Todos)</option>
            <option value="CASA">Casa</option>
            <option value="DEPARTAMENTO">Departamento</option>
            <option value="PH">PH</option>
            <option value="TERRENO">Terreno / Lote</option>
            <option value="LOCAL">Local Comercial</option>
            <option value="OFICINA">Oficina</option>
            <option value="QUINTA">Quinta</option>
            <option value="GALPON">Galpón</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
      </div>
    </div>
  );
};
