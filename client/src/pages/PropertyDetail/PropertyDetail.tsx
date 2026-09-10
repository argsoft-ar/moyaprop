import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../../features/properties/services/propertyService';
import { Property } from '../../types/property.types';
import { PropertyGallery } from '../../features/properties/components/PropertyGallery/PropertyGallery';
import { PropertyMap } from '../../features/properties/components/PropertyMap';
import { PropertySpecs } from '../../features/properties/components/PropertySpecs';
import { PropertyContactCard } from '../../features/properties/components/PropertyContactCard';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import { Footer } from '../../components/layout/Footer/Footer';
import { Spinner, Badge, EmptyState, LegalDisclaimer } from '../../components/ui';
import { formatPrice, buildWhatsAppUrl } from '../../utils/formatters';
import { brandConfig } from '../../config/brand.config';
import { MapPin, MessageCircle, ArrowLeft, Printer } from 'lucide-react';
import styles from './PropertyDetail.module.css';

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const whatsappPhone = brandConfig.contact.whatsappPhone;

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
        <EmptyState
          title="Publicación no disponible"
          description={error || 'El inmueble que buscas no existe o ha sido pausado.'}
          backLink={{ to: '/', label: 'Volver al catálogo principal' }}
        />
        <Footer />
      </div>
    );
  }

  const isSale = property.operationType === 'VENTA';
  const whatsappUrl = buildWhatsAppUrl(whatsappPhone, property.title, window.location.href);

  // Enlace para compartir la propiedad por WhatsApp a cualquier persona o grupo
  const shareWhatsAppMessage = encodeURIComponent(
    `¡Hola! Te comparto esta propiedad en ${brandConfig.name}:\n\n*${property.title}*\n📍 ${property.address}, ${property.city}\n💰 ${formatPrice(property.price, property.currency)}\n\n👉 Ver publicación completa:\n${window.location.href}`
  );
  const shareWhatsAppUrl = `https://api.whatsapp.com/send?text=${shareWhatsAppMessage}`;

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

            <div className={styles.topActionsGroup}>
              <Link
                to={`/propiedad/${property.id}/imprimir`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.printActionBtn}
                title="Abrir ficha resumida para imprimir o guardar en PDF"
              >
                <Printer size={17} />
                <span>Imprimir Ficha</span>
              </Link>

              <a
                href={shareWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shareWhatsAppBtn}
                title="Compartir esta propiedad por WhatsApp"
              >
                <MessageCircle size={17} />
                <span>Compartir</span>
              </a>
            </div>
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
              <PropertySpecs property={property} />

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

              {/* Cláusula Legal / Disclaimer */}
              <LegalDisclaimer />
            </div>

            {/* Columna Derecha: Tarjeta de Precio y Contacto Fijo */}
            <div className={styles.rightCol}>
              <PropertyContactCard property={property} whatsappUrl={whatsappUrl} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
