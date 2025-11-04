import axios from 'axios';
import config from '../config';

// Log de la URL del API para debugging
console.log('🌐 API URL configurada:', config.apiUrl);

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request para agregar token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('niblion_user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    // Agregar idioma actual
    const language = localStorage.getItem('niblion_language') || 'es';
    config.headers['Accept-Language'] = language;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejo de errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const isLoginRequest = error.config.url?.includes('/auth/login');

      switch (error.response.status) {
        case 401:
          // NO redirigir si es un intento de login (para mostrar el error)
          if (!isLoginRequest) {
            // Token inválido o expirado en otras peticiones
            localStorage.removeItem('niblion_user');
            window.location.href = '/login';
          }
          break;
        case 403:
          // Sin permisos
          console.error('Acceso denegado');
          break;
        case 429:
          // Rate limit excedido
          console.error('Demasiadas peticiones, intenta más tarde');
          break;
        case 500:
          // Error del servidor
          console.error('Error del servidor');
          break;
        default:
          console.error('Error:', error.response?.data?.message || error.message);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('Sin respuesta del servidor');
    } else {
      // Error al configurar la petición
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
