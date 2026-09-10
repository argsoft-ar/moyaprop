import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../features/properties/services/propertyService';
import { Property } from '../../types/property.types';
import { formatPrice, formatArea } from '../../utils/formatters';
import { brandConfig } from '../../config/brand.config';
import { Spinner, EmptyState, LegalDisclaimer } from '../../components/ui';
import { Printer, ArrowLeft } from 'lucide-react';
import styles from './PropertyPrint.module.css';

export const PropertyPrint: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudo cargar la propiedad para imprimir');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <Spinner size="lg" />
        <p style={{ color: '#64748b' }}>Generando ficha imprimible...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <EmptyState
        title="No pudimos generar la ficha"
        description={error || 'La propiedad solicitada no se encuentra disponible.'}
        backLink={{ to: '/', label: 'Volver al catálogo principal' }}
      />
    );
  }

  const isSale = property.operationType === 'VENTA';
  // Solo la primer imagen (portada) en formato cuadrado
  const coverImage =
    property.images.find((img) => img.isCover)?.url ||
    property.images[0]?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const currentDate = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className={styles.pageWrapper}>
      {/* Barra de Acciones Superior (No se imprime) */}
      <div className={styles.actionBar}>
        <div className={styles.actionContent}>
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => navigate(`/propiedad/${property.id}`)}
            >
              <ArrowLeft size={16} />
              <span>Volver a la publicación</span>
            </button>

            <button
              type="button"
              className={styles.printBtn}
              onClick={handlePrint}
            >
              <Printer size={16} />
              <span>Imprimir / Guardar en PDF</span>
            </button>
          </div>

          <span className={styles.printTip}>
            Ficha configurada para hoja <strong>A4</strong>. En el diálogo de impresión puedes elegir tu impresora o <strong>«Guardar como PDF»</strong>.
          </span>
        </div>
      </div>

      {/* Hoja A4 Imprimible */}
      <div className={styles.sheetContainer}>
        {/* 1. Encabezado Corporativo */}
        <header className={styles.headerRow}>
          <div className={styles.brandCol}>
            <div className={styles.logoText}>
              {brandConfig.brandPrefix}
              <span className={styles.logoHighlight}>{brandConfig.brandHighlight}</span>
            </div>
            <span className={styles.logoSlogan}>«{brandConfig.slogan}»</span>
          </div>

          <div className={styles.contactCol}>
            <span className={styles.contactAgent}>{brandConfig.agent.name} • {brandConfig.agent.title}</span>
            <span>Tel / WhatsApp: {brandConfig.contact.phone}</span>
            <span>Email: {brandConfig.contact.email}</span>
            <span>{brandConfig.contact.location}</span>
          </div>
        </header>

        {/* 2. Bloque Principal: Imagen Cuadrada (Izquierda) + Detalles (Derecha) */}
        <div className={styles.mainInfoGrid}>
          {/* Imagen Cuadrada */}
          <div className={styles.squareImageWrapper}>
            <img
              src={coverImage}
              alt={property.title}
              className={styles.squareImage}
            />
          </div>

          {/* Detalles al lado de la Imagen */}
          <div className={styles.detailsCol}>
            <div className={styles.detailsTopRow}>
              <div className={styles.badgeGroup}>
                <span className={`${styles.badge} ${isSale ? styles.badgeSale : styles.badgeRent}`}>
                  {property.operationType}
                </span>
                <span className={`${styles.badge} ${styles.badgeType}`}>
                  {property.propertyType}
                </span>
                <span className={styles.referenceBadge}>
                  REF: {property.id.substring(0, 8).toUpperCase()}
                </span>
              </div>

              <div className={styles.priceBlock}>
                <span className={styles.priceLabel}>Precio</span>
                <div className={styles.priceValue}>
                  {formatPrice(property.price, property.currency)}
                </div>
                {property.expenses && property.expenses > 0 && (
                  <div className={styles.expensesText}>
                    + {formatPrice(property.expenses, property.currency)} exp.
                  </div>
                )}
              </div>
            </div>

            <div className={styles.titleLocationBlock}>
              <h1 className={styles.propertyTitle}>{property.title}</h1>
              <div className={styles.propertyLocation}>
                📍 {property.address}, {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
              </div>
            </div>

            {/* Características en grilla completa en la columna de detalles */}
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Sup. Total</span>
                <span className={styles.specVal}>{formatArea(property.totalArea)}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Sup. Cubierta</span>
                <span className={styles.specVal}>{formatArea(property.coveredArea)}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Dormitorios</span>
                <span className={styles.specVal}>{property.bedrooms > 0 ? property.bedrooms : '-'}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Baños</span>
                <span className={styles.specVal}>{property.bathrooms > 0 ? property.bathrooms : '-'}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Cocheras</span>
                <span className={styles.specVal}>{property.garages > 0 ? property.garages : '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Sección Inferior: Descripción del Inmueble (Ancho Completo para textos extensos) */}
        <section className={styles.descriptionSection}>
          <h3 className={styles.sectionHeading}>Descripción del Inmueble</h3>
          <div className={styles.descContent}>
            {property.description.split('\n').filter(Boolean).map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Cláusula Legal / Disclaimer */}
        <LegalDisclaimer variant="print" text={`* ${brandConfig.legal.disclaimer}`} />

        {/* 4. Pie de Página */}
        <footer className={styles.sheetFooter}>
          <span>{brandConfig.name} • Gestión Inmobiliaria Profesional • Documento informativo no contractual</span>
          <span>Ficha emitida: {currentDate}</span>
        </footer>
      </div>
    </div>
  );
};
