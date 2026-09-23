import React from 'react';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Property, PropertyStatus } from '../../../../types/property.types';
import { formatPrice } from '../../../../utils/formatters';
import { EmptyState } from '../../../../components/ui';
import styles from './PropertyTable.module.css';

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (id: string, newStatus: PropertyStatus) => void;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No se encontraron propiedades en el inventario"
        description="Publica una nueva propiedad o cambia los filtros de estado para ver publicaciones."
      />
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thProperty}>Inmueble</th>
            <th className={styles.thPrice}>Precio</th>
            <th className={styles.thStatus}>Estado (1-Clic)</th>
            <th className={styles.actionsHeader}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => {
            const cover = p.images.find((img) => img.isCover)?.url || p.images[0]?.url || '';

            return (
              <tr key={p.id}>
                <td className={styles.propertyCol}>
                  <div className={styles.propertyCell}>
                    <div className={styles.thumbWrapper}>
                      {cover ? (
                        <img src={cover} alt={p.title} className={styles.thumb} />
                      ) : (
                        <div className={styles.noThumb}>Sin foto</div>
                      )}
                    </div>
                    <div className={styles.infoWrapper}>
                      <span className={styles.title} title={p.title}>{p.title}</span>
                      <span className={styles.addressText} title={`${p.address}${p.city ? ` - ${p.city}` : ''}`}>
                        {p.address}{p.city ? ` - ${p.city}` : ''}
                      </span>
                    </div>
                  </div>
                </td>

                <td className={styles.priceCol}>
                  <span className={styles.priceValue}>{formatPrice(p.price, p.currency)}</span>
                </td>

                <td className={styles.statusCol}>
                  <select
                    className={`${styles.statusSelect} ${styles[`status_${p.status}`]}`}
                    value={p.status}
                    onChange={(e) => onStatusChange(p.id, e.target.value as PropertyStatus)}
                    aria-label={`Cambiar estado de ${p.title}`}
                  >
                    <option value="ACTIVA">Activo</option>
                    <option value="SUSPENDIDA">Suspendido</option>
                    <option value="RESERVADA">Reservado</option>
                    <option value="VENDIDA">Vendido</option>
                  </select>
                </td>

                <td className={styles.actionsCol}>
                  <div className={styles.actionsCell}>
                    <a
                      href={`/propiedad/${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${styles.actionBtn} ${styles.viewBtn}`}
                      title="Ver en web pública"
                      aria-label="Ver propiedad"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => onEdit(p)}
                      title="Editar propiedad"
                      aria-label="Editar propiedad"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => onDelete(p.id, p.title)}
                      title="Eliminar propiedad"
                      aria-label="Eliminar propiedad"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
