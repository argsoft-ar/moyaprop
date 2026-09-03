import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminService, CreatePropertyInput } from '../../features/admin/services/adminService';
import { Property } from '../../types/property.types';
import { PropertyForm } from '../../features/admin/components/PropertyForm/PropertyForm';
import { Spinner } from '../../components/ui/Spinner';
import styles from '../AdminPropertyCreate/AdminPropertyCreate.module.css';

export const AdminPropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      try {
        const data = await adminService.getPropertyById(id);
        setProperty(data);
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || 'Error al cargar la propiedad');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleSubmit = async (data: CreatePropertyInput) => {
    if (!id) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await adminService.updateProperty(id, data);
      navigate('/admin');
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Ocurrió un error al actualizar la propiedad.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className={styles.container}>
        <h2>Propiedad no encontrada</h2>
        <Link to="/admin" className={styles.backLink}>
          <ArrowLeft size={16} /> Volver al inventario
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/admin" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Volver al inventario</span>
        </Link>
        <h1 className={styles.title}>Editar Propiedad</h1>
        <p className={styles.subtitle}>
          Modifica los detalles, precios o galería multimedia de "{property.title}".
        </p>
      </div>

      {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}

      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
