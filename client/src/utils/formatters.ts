import { Currency } from '../types/property.types';
import { brandConfig } from '../config/brand.config';

export const formatPrice = (price: number, currency: Currency): string => {
  const symbol = currency === 'USD' ? 'USD ' : '$ ';
  const formatted = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0
  }).format(price);

  return `${symbol}${formatted}`;
};

export const formatArea = (m2: number): string => {
  return `${new Intl.NumberFormat('es-AR').format(m2)} m²`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const buildWhatsAppUrl = (phone: string, propertyTitle: string, propertyUrl: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const message = encodeURIComponent(
    `¡Hola ${brandConfig.name}! Me interesa obtener más información sobre la propiedad: "${propertyTitle}".\nEnlace: ${propertyUrl}`
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
};
