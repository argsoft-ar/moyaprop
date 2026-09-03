import { api } from '../../../services/api';
import { Property, PropertyFilters, PaginatedResponse } from '../../../types/property.types';

export const propertyService = {
  getPublicProperties: async (filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> => {
    const params = new URLSearchParams();

    if (filters.operationType) params.append('operationType', filters.operationType);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.city) params.append('city', filters.city);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.currency) params.append('currency', filters.currency);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<PaginatedResponse<Property>>(`/properties?${params.toString()}`);
    return response.data;
  },

  getPropertyById: async (id: string): Promise<Property> => {
    const response = await api.get<{ success: boolean; data: Property }>(`/properties/${id}`);
    return response.data.data;
  }
};
