import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../../features/properties/services/propertyService';
import { Property, PropertyFilters as FilterType } from '../../types/property.types';
import { PropertyFilters } from '../../features/properties/components/PropertyFilters/PropertyFilters';
import { PropertyGrid } from '../../features/properties/components/PropertyGrid/PropertyGrid';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import { Footer } from '../../components/layout/Footer/Footer';
import { Sparkles, Building2, ShieldCheck, HeartHandshake } from 'lucide-react';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  // Sincronizar filtros desde los query params de la URL
  const operationTypeParam = searchParams.get('operationType') as any;
  const [filters, setFilters] = useState<FilterType>({
    operationType: operationTypeParam || undefined,
    page: 1,
    limit: 12
  });

  useEffect(() => {
    if (operationTypeParam !== filters.operationType) {
      setFilters((prev) => ({ ...prev, operationType: operationTypeParam || undefined, page: 1 }));
    }
  }, [operationTypeParam]);

  const loadProperties = async (currentFilters: FilterType) => {
    setIsLoading(true);
    try {
      const result = await propertyService.getPublicProperties(currentFilters);
      setProperties(result.data);
      setMeta({
        total: result.meta.total,
        page: result.meta.page,
        totalPages: result.meta.totalPages
      });
    } catch (error) {
      console.error('Error cargando propiedades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    // Actualizar URL
    const params: Record<string, string> = {};
    if (newFilters.operationType) params.operationType = newFilters.operationType;
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchParams({});
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <Sparkles size={16} />
            <span>MoyaProp • Inmobiliaria Autogestionable</span>
          </div>
          <h1 className={styles.heroTitle}>
            Tu próximo hogar comienza con una decisión inteligente.
          </h1>
          <p className={styles.heroSubtitle}>
            Explora las mejores oportunidades de compra y alquiler con asesoramiento honesto, personalizado y transparente.
          </p>
        </div>
      </section>

      {/* Catálogo y Buscador */}
      <main className={styles.mainSection}>
        <div className={styles.container}>
          <PropertyFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className={styles.catalogHeader}>
            <h2 className={styles.sectionTitle}>
              Propiedades Disponibles ({meta.total})
            </h2>
            <span className={styles.liveIndicator}>Actualizado en tiempo real</span>
          </div>

          <PropertyGrid
            properties={properties}
            isLoading={isLoading}
            onClearFilters={handleResetFilters}
          />

          {/* Paginación */}
          {meta.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                className={styles.pageBtn}
              >
                Anterior
              </button>
              <span className={styles.pageInfo}>
                Página {meta.page} de {meta.totalPages}
              </span>
              <button
                disabled={filters.page === meta.totalPages}
                onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                className={styles.pageBtn}
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Beneficios MoyaProp */}
          <section className={styles.featuresSection}>
            <div className={styles.featureBox}>
              <div className={styles.featureIcon}><Building2 size={24} /></div>
              <h3>Tasaciones Reales</h3>
              <p>Valuamos inmuebles con datos precisos del mercado para asegurar negociaciones justas.</p>
            </div>
            <div className={styles.featureBox}>
              <div className={styles.featureIcon}><ShieldCheck size={24} /></div>
              <h3>Seguridad Jurídica</h3>
              <p>Revisión técnica de escrituras, títulos y contratos para total tranquilidad de las partes.</p>
            </div>
            <div className={styles.featureBox}>
              <div className={styles.featureIcon}><HeartHandshake size={24} /></div>
              <h3>Atención Directa</h3>
              <p>Trato personal y directo con la familia Moya, sin intermediarios ni demoras.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
