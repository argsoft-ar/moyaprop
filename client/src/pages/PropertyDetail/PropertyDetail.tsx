import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../../features/properties/services/propertyService';
import { Property } from '../../types/property.types';
import { PropertyGallery } from '../../features/properties/components/PropertyGallery/PropertyGallery';
import { PropertyMap } from '../../features/properties/components/PropertyMap';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import { Footer } from '../../components/layout/Footer/Footer';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { formatPrice, formatArea, formatDate, buildWhatsAppUrl } from '../../utils/formatters';
import {
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Car,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Share2,
  CheckCircle
} from 'lucide-react';
import styles from './PropertyDetail.module.css';

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '5491112345678';

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No pudimos cargar la propiedad solicitada');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Navbar />
        <div className={styles.centerBox}>
          <Spinner size="lg" />
          <p>Cargando información del inmueble...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.loadingWrapper}>
        <Navbar />
        <div className={styles.centerBox}>
          <h2>Publicación no disponible</h2>
          <p>{error || 'El inmueble que buscas no existe o ha sido pausado.'}</p>
          <Link to="/" className={styles.backButton}>
            <ArrowLeft size={18} />
            <span>Volver al catálogo principal</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isSale = property.operationType === 'VENTA';
  const whatsappUrl = buildWhatsAppUrl(whatsappPhone, property.title, window.location.href);

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Barra Superior de Navegación y Acciones */}
          <div className={styles.topBar}>
            <Link to="/" className={styles.backLink}>
              <ArrowLeft size={16} />
              <span>Volver a propiedades</span>
            </Link>

            <button className={styles.shareButton} onClick={handleShare}>
              {copiedLink ? (
                <>
                  <CheckCircle size={16} className={styles.shareSuccess} />
                  <span>¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>

          {/* Encabezado del Inmueble */}
          <div className={styles.header}>
            <div className={styles.tagsRow}>
              <Badge variant={isSale ? 'sale' : 'rent'}>
                {property.operationType}
              </Badge>
              <Badge variant="default">
                {property.propertyType}
              </Badge>
              {property.featured && (
                <Badge variant="featured">Destacada</Badge>
              )}
            </div>

            <h1 className={styles.title}>{property.title}</h1>

            <div className={styles.location}>
              <MapPin size={18} className={styles.locationIcon} />
              <span>
                {property.address}, {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
              </span>
            </div>
          </div>

          {/* Layout Principal: Galería y Sidebar de Contacto */}
          <div className={styles.layoutGrid}>
            <div className={styles.leftCol}>
              {/* Galería de Fotografías */}
              <PropertyGallery images={property.images} title={property.title} />

              {/* Ficha Técnica Rápida */}
              <div className={styles.specsBox}>
                <h3 className={styles.boxTitle}>Características Principales</h3>
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

              {/* Descripción */}
              <div className={styles.descriptionBox}>
                <h3 className={styles.boxTitle}>Descripción del Inmueble</h3>
                <div className={styles.descriptionText}>
                  {property.description.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Mapa de Ubicación Google Maps */}
              <PropertyMap
                address={property.address}
                city={property.city}
                neighborhood={property.neighborhood}
                title={property.title}
              />
            </div>

            {/* Columna Derecha: Tarjeta de Precio y Contacto Fijo */}
            <div className={styles.rightCol}>
              <div className={styles.stickyCard}>
                <div className={styles.priceHeader}>
                  <span className={styles.priceLabel}>Precio de publicación</span>
                  <div className={styles.priceNumber}>
                    {formatPrice(property.price, property.currency)}
                  </div>
                  {property.expenses && property.expenses > 0 && (
                    <span className={styles.expensesText}>
                      + {formatPrice(property.expenses, property.currency)} expensas
                    </span>
                  )}
                </div>

                <div className={styles.contactActionBox}>
                  <p className={styles.contactPrompt}>
                    ¿Te interesa coordinar una visita o consultar más información sobre esta propiedad?
                  </p>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappActionBtn}
                  >
                    <MessageCircle size={20} />
                    <span>Contactar por WhatsApp</span>
                  </a>

                  <div className={styles.contactGuarantee}>
                    <span>Respuesta directa del equipo MoyaProp</span>
                  </div>
                </div>

                <div className={styles.metaSummary}>
                  <div className={styles.metaRow}>
                    <span>Código de referencia:</span>
                    <strong>{property.id.substring(0, 8).toUpperCase()}</strong>
                  </div>
                  <div className={styles.metaRow}>
                    <span>Operación:</span>
                    <strong>{property.operationType}</strong>
                  </div>
                  <div className={styles.metaRow}>
                    <span>Tipo:</span>
                    <strong>{property.propertyType}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
