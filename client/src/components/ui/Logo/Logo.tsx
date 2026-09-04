import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark'; // 'light' para fondos blancos, 'dark' para fondos oscuros (footer/sidebar)
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'light',
  className = ''
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#2D2D2D';
  const taglineColor = isDark ? '#9E9E9E' : '#757575';

  return (
    <div className={`${styles.logoContainer} ${styles[size]} ${className}`}>
      {/* Isotipo: La M Inmobiliaria con techos naranja #F26522 y sombras #2D2D2D */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.iconSvg}
      >
        {/* Detalle circular superior (sol / ventana de ático) */}
        <circle cx="24" cy="9" r="3.5" fill="#F26522" />

        {/* Techos en M a dos aguas (Naranja Corporativo #F26522) */}
        <path
          d="M6 24L15 14L24 23L33 14L42 24"
          stroke="#F26522"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Columnas / Sombra y soporte de la M (Gris Oscuro #2D2D2D) */}
        <path
          d="M10 23V38C10 39.1 10.9 40 12 40H16C17.1 40 18 39.1 18 38V29C18 27.9 18.9 27 20 27H28C29.1 27 30 27.9 30 29V38C30 39.1 30.9 40 32 40H36C37.1 40 38 39.1 38 38V23"
          stroke={isDark ? '#E5E5E5' : '#2D2D2D'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Punto de acento central inferior */}
        <circle cx="24" cy="34" r="2" fill="#F26522" />
      </svg>

      {variant === 'full' && (
        <div className={styles.textContainer}>
          <div className={styles.brandTitle} style={{ color: textColor }}>
            MOYA<span className={styles.brandAccent}>PROP</span>
          </div>
          <span className={styles.tagline} style={{ color: taglineColor }}>
            SERVICIOS INMOBILIARIOS
          </span>
        </div>
      )}
    </div>
  );
};
