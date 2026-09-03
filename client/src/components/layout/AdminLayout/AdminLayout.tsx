import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, LayoutDashboard, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import styles from './AdminLayout.module.css';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.container}>
      {/* Sidebar Lateral */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>
              <Home size={20} />
            </div>
            <div className={styles.brandInfo}>
              <span className={styles.brandTitle}>MOYA<span className={styles.accent}>PROP</span></span>
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
          >
            <LayoutDashboard size={18} />
            <span>Inventario Inmuebles</span>
          </Link>

          <Link
            to="/admin/nueva"
            className={`${styles.navItem} ${isActive('/admin/nueva') ? styles.active : ''}`}
          >
            <PlusCircle size={18} />
            <span>Publicar Propiedad</span>
          </Link>

          <div className={styles.divider} />

          <a href="/" target="_blank" rel="noreferrer" className={styles.navItem}>
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
        <header className={styles.topHeader}>
          <div className={styles.topTitle}>
            Gestión Privada MoyaProp
          </div>
          <div className={styles.topActions}>
            <span className={styles.liveBadge}>🟢 Sistema en línea</span>
          </div>
        </header>

        <div className={styles.pageBody}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
