/**
 * Shared: Configuration Manager
 * Centraliza y valida la configuración de la aplicación
 */
export class ConfigurationManager {
  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }

  loadConfiguration() {
    return {
      // Configuración del servidor
      server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
      },

      // Configuración de WhatsApp
      whatsapp: {
        apiToken: process.env.API_TOKEN,
        businessPhone: process.env.BUSINESS_PHONE,
        apiVersion: process.env.API_VERSION || 'v21.0',
        webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
        videoUrls: {
          1: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo1.mp4",
          2: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo2.mp4",
          3: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo3.mp4",
          4: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo4.mp4",
          5: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo5.mp4",
          6: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo6.mp4",
        }
      },

      // Configuración de base de datos
      database: {
        uri: process.env.DATABASE_URI,
        name: 'niblion_analytics'
      },

      // Configuración de funcionalidades
      features: {
        showPruebaTips: process.env.MOSTRAR_TIP_PRUEBA !== 'false',
        sessionTimeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES) || 30,
        enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false',
        enableCleanupJob: process.env.ENABLE_CLEANUP_JOB !== 'false',
        cleanupIntervalMinutes: parseInt(process.env.CLEANUP_INTERVAL_MINUTES) || 60
      },

      // Configuración de URLs externas
      external: {
        certificateUrl: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/Certificado-curso-Phishing.jpg",
        specialImageUrl: "https://i.chzbgr.com/full/6796713984/hF30B7124/furry-query"
      }
    };
  }

  validateConfiguration() {
    const required = [
      { path: 'whatsapp.apiToken', env: 'API_TOKEN' },
      { path: 'whatsapp.businessPhone', env: 'BUSINESS_PHONE' },
      { path: 'whatsapp.webhookVerifyToken', env: 'WEBHOOK_VERIFY_TOKEN' }
    ];

    const missing = [];

    for (const { path, env } of required) {
      if (!this.getNestedValue(this.config, path)) {
        missing.push(env);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Variables de entorno requeridas faltantes: ${missing.join(', ')}`);
    }

    // Validaciones adicionales
    if (!this.config.database.uri) {
      console.warn('⚠️ DATABASE_URI no configurada. Funcionando sin base de datos persistente.');
    }

    console.log('✅ Configuración validada exitosamente');
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  get(path) {
    return this.getNestedValue(this.config, path);
  }

  getConfig() {
    return this.config;
  }

  isDevelopment() {
    return this.config.server.environment === 'development';
  }

  isProduction() {
    return this.config.server.environment === 'production';
  }

  // Método para obtener configuración sanitizada (sin secretos)
  getSanitizedConfig() {
    const sanitized = JSON.parse(JSON.stringify(this.config));
    
    // Ocultar información sensible
    if (sanitized.whatsapp.apiToken) {
      sanitized.whatsapp.apiToken = '***hidden***';
    }
    if (sanitized.database.uri) {
      sanitized.database.uri = sanitized.database.uri.replace(/\/\/[^@]+@/, '//***:***@');
    }

    return sanitized;
  }

  // Método para logging de configuración
  logConfiguration() {
    console.log('🔧 Configuración de la aplicación:');
    console.log('   - Entorno:', this.config.server.environment);
    console.log('   - Puerto:', this.config.server.port);
    console.log('   - WhatsApp API Version:', this.config.whatsapp.apiVersion);
    console.log('   - Base de datos:', this.config.database.uri ? '✅ Configurada' : '⚠️ No configurada');
    console.log('   - Analytics:', this.config.features.enableAnalytics ? '✅ Habilitado' : '❌ Deshabilitado');
    console.log('   - Cleanup automático:', this.config.features.enableCleanupJob ? '✅ Habilitado' : '❌ Deshabilitado');
  }
}