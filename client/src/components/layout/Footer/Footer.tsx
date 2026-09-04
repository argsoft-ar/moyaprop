import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Logo } from '../../ui/Logo/Logo';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '5491112345678';
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contacto">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Marca y Propósito */}
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <Logo theme="dark" size="md" />
            </div>
            <p className={styles.description}>
              Compromiso, transparencia y asesoramiento inmobiliario personalizado. Ayudamos a encontrar el hogar y la inversión ideal para cada familia.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Navegación</h4>
            <ul className={styles.linkList}>
              <li><a href="/">Inicio</a></li>
              <li><a href="/?operationType=VENTA">Propiedades en Venta</a></li>
              <li><a href="/?operationType=ALQUILER">Propiedades en Alquiler</a></li>
              <li><a href="/admin/login">Acceso Clientes / Admin</a></li>
            </ul>
          </div>

          {/* Contacto Directo */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Contacto</h4>
            <div className={styles.contactItem}>
              <MapPin size={18} className={styles.contactIcon} />
              <span>Zona Norte y Alrededores, Buenos Aires</span>
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
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© {currentYear} MoyaProp. Todos los derechos reservados.</p>
          <p className={styles.developedBy}>Plataforma Inmobiliaria Autogestionable</p>
        </div>
      </div>
    </footer>
  );
};
