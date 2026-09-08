export interface BrandConfig {
  name: string;
  brandPrefix: string;
  brandHighlight: string;
  slogan: string;

  agent: {
    name: string;
    title: string;
    photoUrl: string;
  };

  license: {
    institution: string;
    number: string;
  };

  contact: {
    location: string;
    coverageArea: string;
    phone: string;
    whatsappPhone: string;
    email: string;
    hours: string;
  };

  about: {
    title: string;
    quote: string;
    paragraph1: string;
    paragraph2: string;
  };

  legal: {
    disclaimer: string;
  };

  developer: {
    name: string;
    leadText: string;
  };
}

export const brandConfig: BrandConfig = {
  name: 'MoyaProp',
  brandPrefix: 'MOYA',
  brandHighlight: 'PROP',
  slogan: 'Construyendo confianza en la gestión',

  agent: {
    name: 'Carlos Moya',
    title: 'Titular & Asesor Inmobiliario',
    photoUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
  },

  license: {
    institution: 'C.M.C.P.L.Z',
    number: 'Col. 4238'
  },

  contact: {
    location: 'Burzaco, Buenos Aires',
    coverageArea: 'Zona Sur y alrededores',
    phone: '+54 9 11 1234-5678',
    whatsappPhone: '5491112345678',
    email: 'contacto@moyaprop.com',
    hours: 'Lunes a Viernes de 9 a 18 hs'
  },

  about: {
    title: 'Nuestra trayectoria en el mercado inmobiliario',
    quote:
      '«Nuestra finalidad es brindar todas las alternativas posibles para culminar cualquier negocio inmobiliario con éxito, cumpliendo así, con las necesidades y exigencias de cada uno de nuestros clientes.»',
    paragraph1:
      'Somos una joven empresa familiar, con una vasta experiencia en el mercado inmobiliario, habiendo formado parte en su momento, del staff de ventas de una de las más reconocidas empresas inmobiliarias de la zona sur del gran Buenos Aires.',
    paragraph2:
      'Estamos para asesorarlo y acompañarlo en cada uno de los procesos del negocio inmobiliario, comprendiendo el valor trascendental que tiene tomar la decisión de adquirir su ansiada vivienda o la de realizar la mejor inversión para resguardar sus ahorros.'
  },

  legal: {
    disclaimer:
      'Las imágenes publicadas no son necesariamente vinculantes ni tampoco contractuales. Las medidas enunciadas son aproximadas y han sido dadas al sólo hecho orientativo, las exactas surgirán del respectivo título, plano y/o plancheta catastral.'
  },

  developer: {
    name: 'ARGSOFT',
    leadText: 'Desarrollado por'
  }
};
