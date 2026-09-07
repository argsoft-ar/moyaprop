import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Maximize2, Sparkles, ArrowRight } from 'lucide-react';
import { Property } from '../../../../types/property.types';
import { formatPrice, formatArea } from '../../../../utils/formatters';
import { Badge } from '../../../../components/ui/Badge';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const coverImage =
    property.images.find((img) => img.isCover)?.url ||
    property.images[0]?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const isSale = property.operationType === 'VENTA';

  return (
    <article className={styles.card}>
      <Link
        to={`/propiedad/${property.id}`}
        className={styles.cardLink}
        aria-label={`Ver detalles de ${property.title}`}
      >
        <div className={styles.imageWrapper}>
          <img
            src={coverImage}
            alt={property.title}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.overlayBadges}>
            <Badge variant={isSale ? 'sale' : 'rent'}>
              {property.operationType}
            </Badge>
            {property.featured && (
              <Badge variant="featured" className={styles.featuredBadge}>
                <Sparkles size={12} /> Destacada
              </Badge>
            )}
          </div>
          <span className={styles.typeTag}>{property.propertyType}</span>
        </div>

        <div className={styles.content}>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {formatPrice(property.price, property.currency)}
            </span>
            {property.expenses && property.expenses > 0 && (
              <span className={styles.expenses}>
                + {formatPrice(property.expenses, property.currency)} exp.
              </span>
            )}
          </div>

          <h3 className={styles.title} title={property.title}>
            {property.title}
          </h3>

          <div className={styles.location}>
            <MapPin size={15} className={styles.locationIcon} />
            <span>
              {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
            </span>
          </div>

          <div className={styles.features}>
            <div className={styles.featureItem} title="Superficie total">
              <Maximize2 size={16} />
              <span>{formatArea(property.totalArea)}</span>
            </div>
            {property.bedrooms > 0 && (
              <div className={styles.featureItem} title="Dormitorios">
                <BedDouble size={16} />
                <span>{property.bedrooms} dorm.</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className={styles.featureItem} title="Baños">
                <Bath size={16} />
                <span>{property.bathrooms} baños</span>
              </div>
            )}
          </div>

          <div className={styles.ctaRow}>
            <span className={styles.ctaButton}>
              <span>Ver propiedad</span>
              <ArrowRight size={16} className={styles.ctaIcon} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};
