export type OperationType = 'VENTA' | 'ALQUILER';

export type PropertyType =
  | 'CASA'
  | 'DEPARTAMENTO'
  | 'PH'
  | 'TERRENO'
  | 'LOCAL'
  | 'OFICINA'
  | 'QUINTA'
  | 'GALPON'
  | 'OTRO';

export type Currency = 'USD' | 'ARS';

export type PropertyStatus = 'ACTIVA' | 'PAUSADA' | 'VENDIDA' | 'ALQUILADA';

export interface PropertyImage {
  id: string;
  url: string;
  publicId: string;
  order: number;
  isCover: boolean;
  propertyId?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  operationType: OperationType;
  propertyType: PropertyType;
  price: number;
  currency: Currency;
  expenses?: number | null;
  totalArea: number;
  coveredArea: number;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  address: string;
  city: string;
  neighborhood?: string | null;
  status: PropertyStatus;
  featured: boolean;
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  operationType?: OperationType;
  propertyType?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: Currency;
  bedrooms?: number;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
