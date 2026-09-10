import React from 'react';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Property, PropertyStatus } from '../../../../types/property.types';
import { formatPrice } from '../../../../utils/formatters';
import { Badge, EmptyState } from '../../../../components/ui';
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
            <th>Inmueble</th>
            <th>Operación / Tipo</th>
            <th>Precio</th>
            <th>Ubicación</th>
            <th>Estado (1-Clic)</th>
            <th className={styles.actionsHeader}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => {
            const cover = p.images.find((img) => img.isCover)?.url || p.images[0]?.url || '';

            return (
              <tr key={p.id}>
                <td>
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
                      <span className={styles.metaText}>{p.bedrooms} dorm. • {p.totalArea} m²</span>
                    </div>
                  </div>
                </td>

                <td>
                  <div className={styles.tagGroup}>
                    <Badge variant={p.operationType === 'VENTA' ? 'sale' : 'rent'} size="sm">
                      {p.operationType}
                    </Badge>
                    <span className={styles.typeText}>{p.propertyType}</span>
                  </div>
                </td>

                <td className={styles.priceCol}>
                  <strong>{formatPrice(p.price, p.currency)}</strong>
                </td>

                <td>
                  <div className={styles.locationCell}>
                    <span>{p.city}</span>
                    <small className={styles.addressText}>{p.address}</small>
                  </div>
                </td>

                <td>
                  <select
                    className={`${styles.statusSelect} ${styles[`status_${p.status}`]}`}
                    value={p.status}
                    onChange={(e) => onStatusChange(p.id, e.target.value as PropertyStatus)}
                  >
                    <option value="ACTIVA">🟢 Activa</option>
                    <option value="PAUSADA">🟡 Pausada</option>
                    <option value="VENDIDA">🟣 Vendida</option>
                    <option value="ALQUILADA">🟣 Alquilada</option>
                  </select>
                </td>

                <td>
                  <div className={styles.actionsCell}>
                    <a
                      href={`/propiedad/${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.actionBtn}
                      title="Ver en web pública"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button
                      className={styles.actionBtn}
                      onClick={() => onEdit(p)}
                      title="Editar propiedad"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => onDelete(p.id, p.title)}
                      title="Eliminar propiedad"
                    >
                      <Trash2 size={16} />
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
