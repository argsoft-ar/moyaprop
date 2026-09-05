import React from 'react';
import { Home, Phone, Mail, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '5491112345678';
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Marca y Propósito */}
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <div className={styles.logoIcon}>
                <Home size={20} />
              </div>
              <span className={styles.brandName}>MOYA<span className={styles.brandHighlight}>PROP</span></span>
            </div>
            <p className={styles.sloganLine}>«Construyendo confianza en la gestión»</p>
            <p className={styles.description}>
              Empresa familiar con vasta experiencia en el mercado inmobiliario de la zona sur del Gran Buenos Aires. Brindamos todas las alternativas para culminar tu operación con éxito y total seguridad.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Navegación</h4>
            <ul className={styles.linkList}>
              <li><a href="/">Inicio</a></li>
              <li><a href="/#propiedades">Catálogo de Propiedades</a></li>
              <li><a href="/#nosotros">Sobre Nosotros</a></li>
              <li><a href="/#contacto">Canales de Contacto</a></li>
              <li><a href="/admin/login">Acceso Exclusivo Administración</a></li>
            </ul>
          </div>

          {/* Contacto Directo */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Contacto Directo</h4>
            <div className={styles.contactItem}>
              <MapPin size={18} className={styles.contactIcon} />
              <span>Zona Sur del Gran Buenos Aires y Alrededores</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={18} className={styles.contactIcon} />
              <span>+54 9 11 1234-5678</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} className={styles.contactIcon} />
              <span>contacto@moyaprop.com</span>
            </div>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <MessageCircle size={18} />
              <span>Escríbenos por WhatsApp</span>
            </a>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© {currentYear} MoyaProp. Todos los derechos reservados.</p>
          <p className={styles.developedBy}>Construyendo confianza en la gestión</p>
        </div>
      </div>
    </footer>
  );
};
