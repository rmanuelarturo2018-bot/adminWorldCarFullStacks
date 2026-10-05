import axios from 'axios';

// En desarrollo, Vite redirige /api al backend mediante proxy.
// En producción, puedes dejar VITE_API_BASE como la URL real del backend.
const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Cambiar a true si se usan cookies/sesiones entre dominios
  withCredentials: false,
});

// Interceptor: adjunta el token de localStorage en cada petición automáticamente
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
