export const OPERATION_TYPES = {
  VENTA: 'VENTA',
  ALQUILER: 'ALQUILER'
} as const;

export const PROPERTY_TYPES = {
  CASA: 'CASA',
  DEPARTAMENTO: 'DEPARTAMENTO',
  PH: 'PH',
  TERRENO: 'TERRENO',
  LOCAL: 'LOCAL',
  OFICINA: 'OFICINA',
  QUINTA: 'QUINTA',
  GALPON: 'GALPON',
  OTRO: 'OTRO'
} as const;

export const CURRENCIES = {
  USD: 'USD',
  ARS: 'ARS'
} as const;

export const PROPERTY_STATUS = {
  ACTIVA: 'ACTIVA',
  PAUSADA: 'PAUSADA',
  VENDIDA: 'VENDIDA',
  ALQUILADA: 'ALQUILADA'
} as const;

export const DEFAULT_PAGE_SIZE = 12;
