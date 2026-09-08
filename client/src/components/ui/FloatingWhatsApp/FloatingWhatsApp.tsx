import React from 'react';
import { useLocation } from 'react-router-dom';
import { brandConfig } from '../../../config/brand.config';
import styles from './FloatingWhatsApp.module.css';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  defaultMessage = `¡Hola ${brandConfig.name}! Quisiera hacer una consulta sobre propiedades.`
}) => {
  const location = useLocation();

  // No mostrar el botón flotante si estamos dentro del panel de administración o en la hoja de impresión
  if (location.pathname.startsWith('/admin') || location.pathname.includes('/imprimir')) {
    return null;
  }

  const phone = phoneNumber || brandConfig.contact.whatsappPhone;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floatingBtn}
      aria-label={`Contactar por WhatsApp a ${brandConfig.name}`}
      title="Contactanos por WhatsApp"
    >
      <span className={styles.pulseRing} />
      
      {/* Icono Oficial WhatsApp */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.17 22L7.42 20.62C8.88 21.41 10.45 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2Z"
          fill="currentColor"
        />
        <path
          d="M17.47 14.38C17.17 14.23 15.69 13.5 15.41 13.4C15.14 13.3 14.94 13.25 14.74 13.55C14.54 13.85 13.97 14.53 13.79 14.73C13.62 14.93 13.44 14.96 13.14 14.81C12.84 14.66 11.87 14.34 10.73 13.32C9.83 12.52 9.23 11.54 9.06 11.24C8.88 10.94 9.04 10.78 9.19 10.63C9.33 10.5 9.49 10.28 9.64 10.11C9.79 9.93 9.84 9.81 9.94 9.61C10.04 9.41 9.99 9.23 9.92 9.08C9.84 8.93 9.24 7.45 8.99 6.85C8.75 6.27 8.5 6.34 8.32 6.34C8.14 6.33 7.94 6.33 7.74 6.33C7.54 6.33 7.22 6.4 6.94 6.7C6.67 7 5.89 7.73 5.89 9.2C5.89 10.68 6.97 12.1 7.12 12.3C7.27 12.5 9.23 15.53 12.24 16.83C15.25 18.13 15.25 17.7 15.8 17.65C16.35 17.59 17.58 16.92 17.83 16.22C18.08 15.52 18.08 14.92 18.01 14.79C17.93 14.67 17.77 14.53 17.47 14.38Z"
          fill="#25D366"
        />
        <path
          d="M17.47 14.38C17.17 14.23 15.69 13.5 15.41 13.4C15.14 13.3 14.94 13.25 14.74 13.55C14.54 13.85 13.97 14.53 13.79 14.73C13.62 14.93 13.44 14.96 13.14 14.81C12.84 14.66 11.87 14.34 10.73 13.32C9.83 12.52 9.23 11.54 9.06 11.24C8.88 10.94 9.04 10.78 9.19 10.63C9.33 10.5 9.49 10.28 9.64 10.11C9.79 9.93 9.84 9.81 9.94 9.61C10.04 9.41 9.99 9.23 9.92 9.08C9.84 8.93 9.24 7.45 8.99 6.85C8.75 6.27 8.5 6.34 8.32 6.34C8.14 6.33 7.94 6.33 7.74 6.33C7.54 6.33 7.22 6.4 6.94 6.7C6.67 7 5.89 7.73 5.89 9.2C5.89 10.68 6.97 12.1 7.12 12.3C7.27 12.5 9.23 15.53 12.24 16.83C15.25 18.13 15.25 17.7 15.8 17.65C16.35 17.59 17.58 16.92 17.83 16.22C18.08 15.52 18.08 14.92 18.01 14.79C17.93 14.67 17.77 14.53 17.47 14.38Z"
          fill="#FFFFFF"
        />
      </svg>

      <span className={styles.tooltip}>¿En qué podemos ayudarte? Escribinos</span>
    </a>
  );
};
