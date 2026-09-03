import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Layouts
import { AdminLayout } from './components/layout/AdminLayout/AdminLayout';

// Páginas Públicas
import { Home } from './pages/Home/Home';
import { PropertyDetail } from './pages/PropertyDetail/PropertyDetail';

// Páginas Privadas (Admin)
import { AdminLogin } from './pages/AdminLogin/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import { AdminPropertyCreate } from './pages/AdminPropertyCreate/AdminPropertyCreate';
import { AdminPropertyEdit } from './pages/AdminPropertyEdit/AdminPropertyEdit';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/propiedad/:id" element={<PropertyDetail />} />

          {/* Autenticación Panel Moya */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Rutas Protegidas del Panel de Administración */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/nueva" element={<AdminPropertyCreate />} />
              <Route path="/admin/editar/:id" element={<AdminPropertyEdit />} />
            </Route>
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
