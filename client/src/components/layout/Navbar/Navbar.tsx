import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Menu, X } from 'lucide-react';
import { brandConfig } from '../../../config/brand.config';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (targetId?: string) => {
    closeMobileMenu();

    if (!targetId) {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }

    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand} onClick={() => handleNavClick()}>
          <div className={styles.logoIcon}>
            <HomeIcon size={22} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>
              {brandConfig.brandPrefix}
              <span className={styles.brandHighlight}>{brandConfig.brandHighlight}</span>
            </span>
          </div>
        </Link>

        {/* Navegación Desktop */}
        <nav className={styles.navDesktop}>
          <button
            type="button"
            className={`${styles.navLink} ${location.pathname === '/' && !location.hash ? styles.active : ''}`}
            onClick={() => handleNavClick()}
          >
            Inicio
          </button>

          <button
            type="button"
            className={`${styles.navLink} ${location.hash === '#propiedades' ? styles.active : ''}`}
            onClick={() => handleNavClick('propiedades')}
          >
            Propiedades
          </button>

          <button
            type="button"
            className={`${styles.navLink} ${location.hash === '#nosotros' ? styles.active : ''}`}
            onClick={() => handleNavClick('nosotros')}
          >
            Nosotros
          </button>

          <button
            type="button"
            className={`${styles.navLink} ${location.hash === '#contacto' ? styles.active : ''}`}
            onClick={() => handleNavClick('contacto')}
          >
            Contacto
          </button>
        </nav>

        {/* Botón Hamburguesa Móvil */}
        <button
          className={styles.menuButton}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <button
            type="button"
            className={styles.mobileNavLink}
            onClick={() => handleNavClick()}
          >
            Inicio
          </button>

          <button
            type="button"
            className={styles.mobileNavLink}
            onClick={() => handleNavClick('propiedades')}
          >
            Propiedades
          </button>

          <button
            type="button"
            className={styles.mobileNavLink}
            onClick={() => handleNavClick('nosotros')}
          >
            Nosotros
          </button>

          <button
            type="button"
            className={styles.mobileNavLink}
            onClick={() => handleNavClick('contacto')}
          >
            Contacto
          </button>
        </div>
      )}
    </header>
  );
};
