/**
 * Configuración del Frontend
 * Este archivo centraliza todas las variables de entorno
 */

export const config = {
  // URL del backend API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // Modo de desarrollo
  isDevelopment: import.meta.env.DEV,

  // Información de debug
  debug: {
    showApiUrl: import.meta.env.DEV, // Mostrar URL en desarrollo
  }
};

// Log de configuración en desarrollo
if (config.isDevelopment) {
  console.log('🔧 Configuración del Frontend:');
  console.log('📡 API URL:', config.apiUrl);
  console.log('🌍 Modo:', import.meta.env.MODE);
}

export default config;
