import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de Peticiones: inyecta JWT si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moyaprop_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Respuestas: gestión de errores no autorizados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si estamos en una ruta de admin y el token expiró, limpiamos y redirigimos
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('moyaprop_token');
        localStorage.removeItem('moyaprop_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);
