import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Star, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { Property, PropertyImage, PropertyStatus, OperationType, PropertyType, Currency } from '../../../../types/property.types';
import { adminService, CreatePropertyInput } from '../../services/adminService';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
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
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    setUploadError(null);

    try {
      const uploaded = await adminService.uploadImages(Array.from(files));
      setImages((prev) => {
        const nextOrder = prev.length;
        const newImgs = uploaded.map((img, idx) => ({
          url: img.url,
          publicId: img.publicId,
          order: nextOrder + idx,
          isCover: prev.length === 0 && idx === 0
        }));
        return [...prev, ...newImgs];
      });
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Error al subir las imágenes');
    } finally {
      setIsUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleSetCover = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isCover: idx === index
      }))
    );
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    setImages((prev) => {
      const list = [...prev];
      const temp = list[index];
      list[index] = list[newIndex];
      list[newIndex] = temp;
      return list.map((item, idx) => ({ ...item, order: idx }));
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      // Si eliminamos la portada, asignamos portada a la primera
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered.map((item, idx) => ({ ...item, order: idx }));
    });
  };

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

        {/* Zona de Carga Masiva */}
        <div className={styles.uploadZone}>
          <input
            type="file"
            id="imageUpload"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploadingImages}
            className={styles.fileInput}
          />
          <label htmlFor="imageUpload" className={styles.uploadLabel}>
            <Upload size={32} className={styles.uploadIcon} />
            <span className={styles.uploadText}>
              {isUploadingImages ? 'Subiendo imágenes a Cloudinary...' : 'Haz clic para seleccionar o arrastra fotos aquí'}
            </span>
            <span className={styles.uploadSubtext}>Formatos admitidos: JPG, PNG, WEBP (Hasta 20 imágenes)</span>
          </label>
        </div>

        {uploadError && <p className={styles.uploadError}>{uploadError}</p>}

        {/* Grilla de Miniaturas y Reordenamiento */}
        {images.length > 0 && (
          <div className={styles.imageGrid}>
            {images.map((img, index) => (
              <div key={img.publicId || index} className={`${styles.imageCard} ${img.isCover ? styles.isCoverCard : ''}`}>
                <img src={img.url} alt={`Foto ${index + 1}`} className={styles.imagePreview} />

                {img.isCover && <span className={styles.coverBadge}>⭐ Portada</span>}

                <div className={styles.imageActions}>
                  <button
                    type="button"
                    onClick={() => handleSetCover(index)}
                    className={`${styles.imgBtn} ${img.isCover ? styles.activeCoverBtn : ''}`}
                    title="Definir como foto de portada"
                  >
                    <Star size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveImage(index, 'up')}
                    disabled={index === 0}
                    className={styles.imgBtn}
                    title="Mover hacia la izquierda"
                  >
                    <ArrowUp size={14} style={{ transform: 'rotate(-90deg)' }} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className={styles.imgBtn}
                    title="Mover hacia la derecha"
                  >
                    <ArrowDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className={`${styles.imgBtn} ${styles.deleteImgBtn}`}
                    title="Eliminar fotografía"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
