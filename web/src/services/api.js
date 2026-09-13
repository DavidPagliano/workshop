import axios from 'axios';

// Creamos una instancia de Axios con la URL del backend desde variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de respuesta: si el servidor devuelve 401 (token inválido/expirado),
// limpiar la sesión y redirigir al login automáticamente.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar credenciales almacenadas
      localStorage.removeItem('workshop_token');
      localStorage.removeItem('workshop_user');
      delete api.defaults.headers.common['Authorization'];

      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;