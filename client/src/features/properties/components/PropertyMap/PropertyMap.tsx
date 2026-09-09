import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { brandConfig } from '../../../../config/brand.config';
import styles from './PropertyMap.module.css';

interface PropertyMapProps {
  address: string;
  city: string;
  neighborhood?: string | null;
  title?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  address,
  city,
  neighborhood,
  title
}) => {
  // Construir la consulta de búsqueda para Google Maps
  const searchAddressParts = [
    address,
    neighborhood || undefined,
    city,
    'Buenos Aires',
    'Argentina'
  ].filter(Boolean);

  const fullQuery = searchAddressParts.join(', ');
  const encodedQuery = encodeURIComponent(fullQuery);

  // Texto legible para mostrar al usuario
  const displayAddress = [
    address,
    neighborhood ? `(${neighborhood})` : '',
    city
  ].filter(Boolean).join(' ');

  // Soporte para API Key opcional de Google Maps o fallback embebido estándar sin costo
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}`
    : `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  return (
    <section className={styles.mapContainer} aria-label="Ubicación en el mapa">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleRow}>
            <MapPin size={22} className={styles.icon} />
            <h3 className={styles.title}>Ubicación en el Mapa</h3>
          </div>
          <p className={styles.addressText}>{displayAddress}</p>
        </div>

        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.openMapsBtn}
          title="Ver en Google Maps y calcular ruta"
        >
          <Navigation size={16} />
          <span>Cómo llegar / Abrir mapa</span>
          <ExternalLink size={14} />
        </a>
      </div>

      <div className={styles.mapWrapper}>
        <iframe
          title={`Ubicación de ${title || address}`}
          src={embedUrl}
          className={styles.mapIframe}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className={styles.footerNote}>
        <MapPin size={14} />
        <span>Ubicación referencial provista por {brandConfig.name}</span>
      </div>
    </section>
  );
};
