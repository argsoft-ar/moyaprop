import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Property } from '../../../../types/property.types';
import { formatPrice } from '../../../../utils/formatters';
import { brandConfig } from '../../../../config/brand.config';
import styles from './PropertyContactCard.module.css';

export interface PropertyContactCardProps {
  property: Property;
  whatsappUrl: string;
  className?: string;
}

export const PropertyContactCard: React.FC<PropertyContactCardProps> = ({
  property,
  whatsappUrl,
  className = ''
}) => {
  return (
    <aside className={`${styles.stickyCard} ${className}`.trim()}>
      {/* Encabezado de Precio */}
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

      {/* Caja de Contacto WhatsApp */}
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
          <span>Respuesta directa del equipo {brandConfig.name}</span>
        </div>
      </div>

      {/* Resumen de Referencia */}
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
    </aside>
  );
};
