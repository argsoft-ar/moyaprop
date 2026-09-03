import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import { adminService } from '../../features/admin/services/adminService';
import { Property, PropertyStatus } from '../../types/property.types';
import { PropertyTable } from '../../features/admin/components/PropertyTable/PropertyTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import styles from './AdminDashboard.module.css';

export const AdminDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  // Modal de Confirmación de Borrado
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const navigate = useNavigate();

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getProperties(page, 20, selectedStatus, searchTerm || undefined);
      setProperties(result.data);
      setMeta({
        total: result.meta.total,
        totalPages: result.meta.totalPages
      });
    } catch (error) {
      console.error('Error cargando inventario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [page, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadProperties();
  };

  const handleStatusChange = async (id: string, newStatus: PropertyStatus) => {
    try {
      // Optimistic update
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      await adminService.updateStatus(id, newStatus);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      loadProperties(); // Revertir si falló
    }
  };

  const handleOpenDelete = (id: string, title: string) => {
    setPropertyToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    try {
      await adminService.deleteProperty(propertyToDelete.id);
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
      loadProperties();
    } catch (error) {
      console.error('Error eliminando propiedad:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Contadores para métricas
  const countActive = properties.filter((p) => p.status === 'ACTIVA').length;
  const countPaused = properties.filter((p) => p.status === 'PAUSADA').length;
  const countClosed = properties.filter((p) => p.status === 'VENDIDA' || p.status === 'ALQUILADA').length;

  return (
    <div className={styles.container}>
      {/* Cabecera con Botón de Acción Principal */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventario de Propiedades</h1>
          <p className={styles.subtitle}>
            Administra tus publicaciones, actualiza estados al instante y publica nuevos inmuebles.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => navigate('/admin/nueva')}
        >
          Publicar Inmueble
        </Button>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total en Catálogo</span>
          <span className={styles.statValue}>{meta.total}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statActive}`}>
          <span className={styles.statLabel}>Activas (Públicas)</span>
          <span className={styles.statValue}>{countActive}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statPaused}`}>
          <span className={styles.statLabel}>Pausadas (Ocultas)</span>
          <span className={styles.statValue}>{countPaused}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statClosed}`}>
          <span className={styles.statLabel}>Vendidas / Alquiladas</span>
          <span className={styles.statValue}>{countClosed}</span>
        </div>
      </div>

      {/* Barra de Filtros Rápidos */}
      <div className={styles.filterBar}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por título, ciudad o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </form>

        <div className={styles.statusFilters}>
          <button
            className={`${styles.filterChip} ${!selectedStatus ? styles.activeChip : ''}`}
            onClick={() => { setSelectedStatus(undefined); setPage(1); }}
          >
            Todos
          </button>
          <button
            className={`${styles.filterChip} ${selectedStatus === 'ACTIVA' ? styles.activeChip : ''}`}
            onClick={() => { setSelectedStatus('ACTIVA'); setPage(1); }}
          >
            🟢 Activas
          </button>
          <button
            className={`${styles.filterChip} ${selectedStatus === 'PAUSADA' ? styles.activeChip : ''}`}
            onClick={() => { setSelectedStatus('PAUSADA'); setPage(1); }}
          >
            🟡 Pausadas
          </button>
          <button
            className={`${styles.filterChip} ${selectedStatus === 'VENDIDA' ? styles.activeChip : ''}`}
            onClick={() => { setSelectedStatus('VENDIDA'); setPage(1); }}
          >
            🟣 Vendidas
          </button>
        </div>
      </div>

      {/* Grilla / Tabla */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spinner size="lg" />
          <p>Cargando inventario inmobiliario...</p>
        </div>
      ) : (
        <PropertyTable
          properties={properties}
          onEdit={(property) => navigate(`/admin/editar/${property.id}`)}
          onDelete={handleOpenDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Paginación */}
      {meta.totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <span className={styles.pageInfo}>Página {page} de {meta.totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Modal de Confirmación para Eliminación */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar eliminación de inmueble"
      >
        <div className={styles.deleteModalContent}>
          <div className={styles.warningIconWrapper}>
            <AlertTriangle size={36} />
          </div>
          <p className={styles.deletePrompt}>
            ¿Estás seguro de que deseas eliminar permanentemente la propiedad:
            <strong> "{propertyToDelete?.title}"</strong>?
          </p>
          <p className={styles.deleteSubprompt}>
            Esta acción eliminará la ficha técnica y todas sus fotografías de la base de datos.
          </p>
          <div className={styles.modalActions}>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
            >
              Sí, eliminar definitivamente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
