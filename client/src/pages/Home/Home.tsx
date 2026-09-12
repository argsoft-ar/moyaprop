import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../../features/properties/services/propertyService';
import { Property, PropertyFilters as FilterType } from '../../types/property.types';
import { PropertyFilters } from '../../features/properties/components/PropertyFilters/PropertyFilters';
import { PropertyGrid } from '../../features/properties/components/PropertyGrid/PropertyGrid';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import { Footer } from '../../components/layout/Footer/Footer';
import { AboutSection } from '../../components/sections/AboutSection/AboutSection';
import { ValuesSection } from '../../components/sections/ValuesSection';
import { ContactSection } from '../../components/sections/ContactSection/ContactSection';
import { Pagination } from '../../components/ui';
import { brandConfig } from '../../config/brand.config';
import { Sparkles } from 'lucide-react';
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

  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProperties = async (currentFilters: FilterType) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await propertyService.getPublicProperties(currentFilters);
      setProperties(result.data);
      setMeta({
        total: result.meta.total,
        page: result.meta.page,
        totalPages: result.meta.totalPages
      });
    } catch (error: any) {
      console.error('Error cargando propiedades:', error);
      if (error.code === 'ERR_NETWORK' || !error.response) {
        setLoadError('El servidor en Render está iniciando (Cold Start). Aguarda unos segundos y presiona Reintentar.');
      } else {
        setLoadError('No se pudieron obtener las propiedades del servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(filters);
  }, [filters]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
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
            <span>{brandConfig.name} • {brandConfig.slogan}</span>
          </div>
          <h1 className={styles.heroTitle}>
            Tu próximo hogar comienza con una decisión inteligente.
          </h1>
          <p className={styles.heroSubtitle}>
            Explora las mejores oportunidades de compra y alquiler con asesoramiento honesto, personalizado y transparente.
          </p>
        </div>
      </section>

      {/* Catálogo y Buscador de Propiedades */}
      <main className={styles.mainSection} id="propiedades">
        <div className={styles.container}>
          <PropertyFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className={styles.catalogHeader}>
            <h2 className={styles.sectionTitle}>
              Catálogo de Propiedades ({meta.total})
            </h2>
            <span className={styles.liveIndicator}>Actualizado en tiempo real</span>
          </div>

          <PropertyGrid
            properties={properties}
            isLoading={isLoading}
            error={loadError}
            onRetry={() => loadProperties(filters)}
            onClearFilters={handleResetFilters}
          />

          {/* Paginación */}
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            align="center"
            onPageChange={(newPage) => setFilters({ ...filters, page: newPage })}
          />
        </div>
      </main>

      {/* Sección: Nosotros */}
      <AboutSection />

      {/* Beneficios y Valores */}
      <ValuesSection />

      {/* Sección: Contacto */}
      <ContactSection />

      <Footer />
    </div>
  );
};
