import { api } from '../../../services/api';
import { Property, PropertyStatus, PaginatedResponse, PropertyImage } from '../../../types/property.types';

export interface CreatePropertyInput {
  title: string;
  description: string;
  operationType: string;
  propertyType: string;
  price: number;
  currency: string;
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
  images: Array<{
    url: string;
    publicId: string;
    order: number;
    isCover: boolean;
  }>;
}

export const adminService = {
  getProperties: async (
    page: number = 1,
    limit: number = 20,
    status?: PropertyStatus,
    search?: string
  ): Promise<PaginatedResponse<Property>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await api.get<PaginatedResponse<Property>>(`/properties/admin/all?${params.toString()}`);
    return response.data;
  },

  getPropertyById: async (id: string): Promise<Property> => {
    const response = await api.get<{ success: boolean; data: Property }>(`/properties/admin/${id}`);
    return response.data.data;
  },

  createProperty: async (data: CreatePropertyInput): Promise<Property> => {
    const response = await api.post<{ success: boolean; data: Property }>('/properties', data);
    return response.data.data;
  },

  updateProperty: async (id: string, data: Partial<CreatePropertyInput>): Promise<Property> => {
    const response = await api.put<{ success: boolean; data: Property }>(`/properties/${id}`, data);
    return response.data.data;
  },

  updateStatus: async (id: string, status: PropertyStatus): Promise<void> => {
    await api.patch(`/properties/${id}/status`, { status });
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },

  uploadImages: async (files: File[]): Promise<PropertyImage[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<{
      success: boolean;
      data: Array<{ url: string; publicId: string; order: number; isCover: boolean }>;
    }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data.map((item, idx) => ({
      id: item.publicId,
      url: item.url,
      publicId: item.publicId,
      order: item.order ?? idx,
      isCover: item.isCover ?? idx === 0
    }));
  },

  deleteImage: async (publicId: string): Promise<void> => {
    await api.delete(`/upload/${publicId}`);
  }
};
