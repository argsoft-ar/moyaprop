import React from 'react';
import { Home, Phone, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { brandConfig } from '../../../config/brand.config';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const whatsappPhone = brandConfig.contact.whatsappPhone;
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Marca, Propósito y Matrícula */}
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <div className={styles.logoIcon}>
                <Home size={20} />
              </div>
              <span className={styles.brandName}>
                {brandConfig.brandPrefix}
                <span className={styles.brandHighlight}>{brandConfig.brandHighlight}</span>
              </span>
            </div>
            <p className={styles.sloganLine}>«{brandConfig.slogan}»</p>
            <p className={styles.description}>
              Somos una joven empresa familiar dedicada a cumplir el sueño de la vivienda propia. Experiencia, compromiso y seriedad como la mejor garantía.
            </p>

            {/* Matrícula Profesional */}
            <div className={styles.licenseBox}>
              <ShieldCheck size={16} className={styles.licenseIcon} />
              <div className={styles.licenseTexts}>
                <span className={styles.licenseDept}>{brandConfig.license.institution}</span>
                <span className={styles.licenseNum}>{brandConfig.license.number}</span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Navegación</h4>
            <ul className={styles.linkList}>
              <li><a href="/">Inicio</a></li>
              <li><a href="/#propiedades">Propiedades</a></li>
              <li><a href="/#nosotros">Nosotros</a></li>
              <li><a href="/#contacto">Contacto</a></li>
            </ul>
          </div>

          {/* Contacto Directo */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Contacto Directo</h4>
            <div className={styles.contactItem}>
              <MapPin size={18} className={styles.contactIcon} />
              <span>{brandConfig.contact.location}</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={18} className={styles.contactIcon} />
              <span>{brandConfig.contact.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} className={styles.contactIcon} />
              <span>{brandConfig.contact.email}</span>
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
          <p>© {currentYear} {brandConfig.name}. Todos los derechos reservados.</p>
          <p className={styles.developedBy}>
            {brandConfig.developer.leadText} <strong className={styles.devCompany}>{brandConfig.developer.name}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
