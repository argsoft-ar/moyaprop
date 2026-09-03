import { z } from 'zod';
import { OperationType, PropertyType, Currency, PropertyStatus } from '@prisma/client';

export const createPropertySchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(120),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  operationType: z.nativeEnum(OperationType),
  propertyType: z.nativeEnum(PropertyType),
  price: z.coerce.number().positive('El precio debe ser un número positivo'),
  currency: z.nativeEnum(Currency).default(Currency.USD),
  expenses: z.coerce.number().nonnegative().optional().nullable(),

  totalArea: z.coerce.number().positive('La superficie total debe ser positiva'),
  coveredArea: z.coerce.number().nonnegative('La superficie cubierta no puede ser negativa'),
  bedrooms: z.coerce.number().int().min(0, 'Las habitaciones no pueden ser negativas').default(0),
  bathrooms: z.coerce.number().int().min(0, 'Los baños no pueden ser negativos').default(0),
  garages: z.coerce.number().int().min(0, 'Las cocheras no pueden ser negativas').default(0),

  address: z.string().min(3, 'La dirección es obligatoria'),
  city: z.string().min(2, 'La localidad es obligatoria'),
  neighborhood: z.string().optional().nullable(),

  status: z.nativeEnum(PropertyStatus).default(PropertyStatus.ACTIVA),
  featured: z.boolean().optional().default(false),

  // Imágenes asociadas (URLs provenientes de Cloudinary)
  images: z.array(z.object({
    url: z.string().url('URL de imagen inválida'),
    publicId: z.string().min(1, 'El publicId de la imagen es obligatorio'),
    order: z.number().int().default(0),
    isCover: z.boolean().default(false)
  })).optional().default([])
});

export const updatePropertySchema = createPropertySchema.partial();

export const updatePropertyStatusSchema = z.object({
  status: z.nativeEnum(PropertyStatus)
});

export const reorderImagesSchema = z.object({
  images: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int(),
    isCover: z.boolean().optional()
  }))
});

export const propertyFilterSchema = z.object({
  operationType: z.nativeEnum(OperationType).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  currency: z.nativeEnum(Currency).optional(),
  bedrooms: z.coerce.number().int().optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12)
});

export type CreatePropertyDto = z.infer<typeof createPropertySchema>;
export type UpdatePropertyDto = z.infer<typeof updatePropertySchema>;
export type PropertyFilterDto = z.infer<typeof propertyFilterSchema>;
