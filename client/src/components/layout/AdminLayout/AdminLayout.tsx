import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, LayoutDashboard, LogOut, ExternalLink, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { brandConfig } from '../../../config/brand.config';
import styles from './AdminLayout.module.css';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.container}>
      {/* Barra Superior Exclusiva para Móvil */}
      <header className={styles.mobileBar}>
        <div className={styles.mobileBrand}>
          {brandConfig.logoUrl ? (
            <img src={brandConfig.logoUrl} alt={brandConfig.name} className={styles.mobileLogo} />
          ) : (
            <div className={styles.logoIcon}>
              <Home size={18} />
            </div>
          )}
          <span className={styles.mobileBrandText}>
            {brandConfig.brandPrefix}
            <span className={styles.accent}>{brandConfig.brandHighlight}</span>
          </span>
        </div>
        <div className={styles.mobileRightActions}>
          <button
            className={styles.mobileLogoutBtn}
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
          <button
            className={styles.menuToggleBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Backdrop para cerrar menú al tocar afuera en móvil */}
      {isMobileMenuOpen && (
        <div className={styles.backdrop} onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Lateral */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            {brandConfig.logoUrl ? (
              <img
                src={brandConfig.logoUrl}
                alt={brandConfig.name}
                className={styles.logoImg}
              />
            ) : (
              <div className={styles.logoIcon}>
                <Home size={20} />
              </div>
            )}
            <div className={styles.brandInfo}>
              <span className={styles.brandTitle}>{brandConfig.brandPrefix}<span className={styles.accent}>{brandConfig.brandHighlight}</span></span>
              <span className={styles.brandSubtitle}>Panel de Control</span>
            </div>
          </div>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'Administrador'}</span>
            <span className={styles.userEmail}>{user?.email || 'admin@moyaprop.com'}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link
            to="/admin"
            className={`${styles.navItem} ${isActive('/admin') ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Inventario Inmuebles</span>
          </Link>

          <Link
            to="/admin/nueva"
            className={`${styles.navItem} ${isActive('/admin/nueva') ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <PlusCircle size={18} />
            <span>Publicar Propiedad</span>
          </Link>

          <div className={styles.divider} />

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={styles.navItem}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ExternalLink size={18} />
            <span>Ver Sitio Web Público</span>
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área Principal de Contenido */}
      <main className={styles.mainContent}>
        <div className={styles.pageBody}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
