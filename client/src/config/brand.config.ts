export interface BrandConfig {
  name: string;
  brandPrefix: string;
  brandHighlight: string;
  logoUrl?: string;
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
  name: 'MoyaPropiedades',
  brandPrefix: 'MOYA',
  brandHighlight: ' Propiedades',
  logoUrl: '/logo.svg',
  slogan: 'Construyendo confianza en la gestión',

  agent: {
    name: 'Dante Moya',
    title: 'Martillero y Corredor Público Inmobiliario',
    photoUrl: 'https://res.cloudinary.com/dry6jcgfn/image/upload/v1789773827/carlos_paileh.webp'
  },

  license: {
    institution: 'C.M.C.P.L.Z',
    number: 'Col. 4238'
  },

  contact: {
    location: 'Burzaco, Buenos Aires',
    coverageArea: 'Zona Sur y alrededores',
    phone: '+54 9 11 3863-3987',
    whatsappPhone: '5491138633987',
    email: 'contacto@moyaprop.com',
    hours: 'Lunes a Viernes de 9 a 18 hs'
  },

  about: {
    title: 'Nuestra trayectoria',
    quote:
      '«Nuestra finalidad es brindar todas las alternativas posibles para culminar cualquier negocio inmobiliario con éxito, cumpliendo así, con las necesidades y exigencias de cada uno de nuestros clientes.»',
    paragraph1:
      'Somos una joven empresa familiar, con una vasta experiencia en el mercado inmobiliario, habiendo formado en su momento, parte del staff de ventas de una de las más reconocidas empresas inmobiliarias de la zona sur del gran Buenos Aires.',
    paragraph2:
      'Estamos para asesorarte y acompañarte en cada uno de los procesos del negocio inmobiliario, comprendiendo el valor trascendental que tiene tomar la decisión de adquirir tu tan ansiada vivienda o la de realizar la mejor inversión para resguardar tus ahorros.'
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
