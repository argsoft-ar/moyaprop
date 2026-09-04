import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { Logo } from '../../ui/Logo/Logo';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand} onClick={closeMobileMenu}>
          <Logo size="md" />
        </Link>

        {/* Navegación Desktop */}
        <nav className={styles.navDesktop}>
          <Link
            to="/"
            className={`${styles.navLink} ${isActive('/') && !location.search ? styles.active : ''}`}
          >
            Inicio
          </Link>
          <Link
            to="/?operationType=VENTA"
            className={`${styles.navLink} ${location.search.includes('VENTA') ? styles.active : ''}`}
          >
            Comprar
          </Link>
          <Link
            to="/?operationType=ALQUILER"
            className={`${styles.navLink} ${location.search.includes('ALQUILER') ? styles.active : ''}`}
          >
            Alquilar
          </Link>
          <a
            href="#contacto"
            className={styles.navLink}
            onClick={(e) => {
              if (location.pathname !== '/') {
                return; // Dejar navegar normal si no está en home
              }
              e.preventDefault();
              document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contacto
          </a>
        </nav>

        {/* Botón de Acceso Admin */}
        <div className={styles.actionsDesktop}>
          {user ? (
            <Link to="/admin" className={styles.adminBadge}>
              <Shield size={16} />
              <span>Panel Admin ({user.name})</span>
            </Link>
          ) : (
            <Link to="/admin/login" className={styles.adminLoginLink} title="Acceso para la familia Moya">
              <Shield size={16} />
              <span>Gestión</span>
            </Link>
          )}
        </div>

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
          <Link to="/" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            Inicio
          </Link>
          <Link to="/?operationType=VENTA" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            Propiedades en Venta
          </Link>
          <Link to="/?operationType=ALQUILER" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            Propiedades en Alquiler
          </Link>
          <a href="#contacto" className={styles.mobileNavLink} onClick={closeMobileMenu}>
            Contacto y Ubicación
          </a>
          <div className={styles.mobileDivider} />
          {user ? (
            <Link to="/admin" className={styles.mobileAdminLink} onClick={closeMobileMenu}>
              <Shield size={18} />
              <span>Ir al Panel de Administración</span>
            </Link>
          ) : (
            <Link to="/admin/login" className={styles.mobileAdminLink} onClick={closeMobileMenu}>
              <Shield size={18} />
              <span>Acceso Administrador Moya</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
