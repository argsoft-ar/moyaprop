import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Property } from '../../../../types/property.types';
import { CreatePropertyInput } from '../../services/adminService';
import { PropertyImageManager } from '../PropertyImageManager';
import { Button, Input, Select } from '../../../../components/ui';
import styles from './PropertyForm.module.css';

const formSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(120),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  operationType: z.enum(['VENTA', 'ALQUILER']),
  propertyType: z.enum(['CASA', 'DEPARTAMENTO', 'PH', 'TERRENO', 'LOCAL', 'OFICINA', 'QUINTA', 'GALPON', 'OTRO']),
  price: z.coerce.number().positive('El precio debe ser positivo'),
  currency: z.enum(['USD', 'ARS']),
  expenses: z.coerce.number().min(0).optional().nullable(),
  totalArea: z.coerce.number().positive('Debe ser mayor a 0'),
  coveredArea: z.coerce.number().min(0, 'No puede ser negativo'),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  garages: z.coerce.number().int().min(0),
  address: z.string().min(3, 'Dirección obligatoria'),
  city: z.string().min(2, 'Localidad obligatoria'),
  neighborhood: z.string().optional().nullable(),
  status: z.enum(['ACTIVA', 'PAUSADA', 'VENDIDA', 'ALQUILADA']),
  featured: z.boolean().default(false)
});

type FormData = z.infer<typeof formSchema>;

interface PropertyFormProps {
  initialData?: Property | null;
  onSubmit: (data: CreatePropertyInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [images, setImages] = useState<Array<{ url: string; publicId: string; order: number; isCover: boolean }>>(
    initialData?.images?.map((img, idx) => ({
      url: img.url,
      publicId: img.publicId,
      order: img.order ?? idx,
      isCover: img.isCover ?? idx === 0
    })) || []
  );

  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      operationType: initialData?.operationType || 'VENTA',
      propertyType: initialData?.propertyType || 'CASA',
      price: initialData?.price || ('' as any),
      currency: initialData?.currency || 'USD',
      expenses: initialData?.expenses ?? 0,
      totalArea: initialData?.totalArea || ('' as any),
      coveredArea: initialData?.coveredArea || ('' as any),
      bedrooms: initialData?.bedrooms ?? 0,
      bathrooms: initialData?.bathrooms ?? 1,
      garages: initialData?.garages ?? 0,
      address: initialData?.address || '',
      city: initialData?.city || '',
      neighborhood: initialData?.neighborhood || '',
      status: initialData?.status || 'ACTIVA',
      featured: initialData?.featured ?? false
    }
  });

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      images
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit as any)} className={styles.form}>
      {/* Sección 1: Datos Principales */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>1. Datos Principales</h4>
        <div className={styles.grid2}>
          <div className={styles.colSpan2}>
            <Input
              label="Título de la publicación *"
              placeholder="Ej: Excelente Casa 4 Ambientes con Piscina en Tigre"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>

          <Select
            label="Tipo de Operación *"
            options={[
              { value: 'VENTA', label: 'Venta' },
              { value: 'ALQUILER', label: 'Alquiler' }
            ]}
            error={errors.operationType?.message}
            {...register('operationType')}
          />

          <Select
            label="Tipo de Propiedad *"
            options={[
              { value: 'CASA', label: 'Casa' },
              { value: 'DEPARTAMENTO', label: 'Departamento' },
              { value: 'PH', label: 'PH' },
              { value: 'TERRENO', label: 'Terreno / Lote' },
              { value: 'LOCAL', label: 'Local Comercial' },
              { value: 'OFICINA', label: 'Oficina' },
              { value: 'QUINTA', label: 'Quinta' },
              { value: 'GALPON', label: 'Galpón' },
              { value: 'OTRO', label: 'Otro' }
            ]}
            error={errors.propertyType?.message}
            {...register('propertyType')}
          />

          <div className={styles.priceRow}>
            <div style={{ width: '110px' }}>
              <Select
                label="Moneda *"
                options={[
                  { value: 'USD', label: 'USD' },
                  { value: 'ARS', label: 'ARS' }
                ]}
                {...register('currency')}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Precio *"
                type="number"
                placeholder="150000"
                error={errors.price?.message}
                {...register('price')}
              />
            </div>
          </div>

          <Input
            label="Expensas (opcional)"
            type="number"
            placeholder="0"
            error={errors.expenses?.message}
            {...register('expenses')}
          />
        </div>
      </div>

      {/* Sección 2: Ubicación */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>2. Ubicación</h4>
        <div className={styles.grid3}>
          <div className={styles.colSpan2}>
            <Input
              label="Dirección exacta *"
              placeholder="Ej: Av. Cazón 1234"
              error={errors.address?.message}
              {...register('address')}
            />
          </div>

          <Input
            label="Localidad / Ciudad *"
            placeholder="Ej: Tigre"
            error={errors.city?.message}
            {...register('city')}
          />

          <div className={styles.colSpan3}>
            <Input
              label="Barrio / Sub-zona (opcional)"
              placeholder="Ej: Rincón de Milberg"
              error={errors.neighborhood?.message}
              {...register('neighborhood')}
            />
          </div>
        </div>
      </div>

      {/* Sección 3: Características Físicas */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>3. Características Físicas</h4>
        <div className={styles.grid4}>
          <Input
            label="Sup. Total (m²) *"
            type="number"
            placeholder="250"
            error={errors.totalArea?.message}
            {...register('totalArea')}
          />

          <Input
            label="Sup. Cubierta (m²) *"
            type="number"
            placeholder="180"
            error={errors.coveredArea?.message}
            {...register('coveredArea')}
          />

          <Input
            label="Habitaciones"
            type="number"
            placeholder="3"
            error={errors.bedrooms?.message}
            {...register('bedrooms')}
          />

          <Input
            label="Baños"
            type="number"
            placeholder="2"
            error={errors.bathrooms?.message}
            {...register('bathrooms')}
          />

          <Input
            label="Cocheras"
            type="number"
            placeholder="1"
            error={errors.garages?.message}
            {...register('garages')}
          />

          <Select
            label="Estado de Publicación *"
            options={[
              { value: 'ACTIVA', label: '🟢 Activa (Visible al público)' },
              { value: 'PAUSADA', label: '🟡 Pausada (Oculta temporalmente)' },
              { value: 'VENDIDA', label: '🟣 Vendida' },
              { value: 'ALQUILADA', label: '🟣 Alquilada' }
            ]}
            {...register('status')}
          />

          <div className={styles.checkboxWrapper}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" {...register('featured')} />
              <span>Marcar como Propiedad Destacada</span>
            </label>
          </div>
        </div>

        <div className={styles.textareaWrapper}>
          <label className={styles.label}>Descripción detallada *</label>
          <textarea
            rows={5}
            placeholder="Describe las virtudes del inmueble, iluminación, terminaciones y comodidades..."
            className={`${styles.textarea} ${errors.description ? styles.hasError : ''}`}
            {...register('description')}
          />
          {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
        </div>
      </div>

      {/* Sección 4: Galería Multimedia */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>4. Galería de Fotografías</h4>
        <p className={styles.sectionDesc}>
          Carga las fotos del inmueble. Puedes ordenarlas y elegir la foto de portada con un solo clic.
        </p>

        <PropertyImageManager
          images={images}
          onChange={setImages}
          onUploadingChange={setIsUploadingImages}
        />
      </div>

      {/* Botones de Acción Finales */}
      <div className={styles.formFooter}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting || isUploadingImages}>
          {initialData ? 'Guardar Cambios' : 'Publicar Inmueble'}
        </Button>
      </div>
    </form>
  );
};
