import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminService, CreatePropertyInput } from '../../features/admin/services/adminService';
import { PropertyForm } from '../../features/admin/components/PropertyForm/PropertyForm';
import styles from './AdminPropertyCreate.module.css';

export const AdminPropertyCreate: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: CreatePropertyInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await adminService.createProperty(data);
      navigate('/admin');
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Ocurrió un error al guardar la propiedad. Revisa los datos.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/admin" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Volver al inventario</span>
        </Link>
        <h1 className={styles.title}>Publicar Nueva Propiedad</h1>
        <p className={styles.subtitle}>
          Completa la ficha técnica del inmueble y carga sus fotografías para que sea visible en la web.
        </p>
      </div>

      {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}

      <PropertyForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
