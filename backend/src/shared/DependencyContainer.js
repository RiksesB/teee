import { DatabaseConnection } from '../infrastructure/database/DatabaseConnection.js';
import { MongoSessionRepository } from '../infrastructure/database/MongoSessionRepository.js';
import { WhatsAppApiService } from '../infrastructure/external/WhatsAppApiService.js';
import { SessionManagementService } from '../application/services/SessionManagementService.js';
import { ConfigurationManager } from '../shared/ConfigurationManager.js';

/**
 * Dependency Injection Container
 * Gestiona las dependencias de la aplicación siguiendo principios de Clean Architecture
 */
export class DependencyContainer {
  constructor() {
    this.dependencies = {};
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      console.log('🚀 Inicializando contenedor de dependencias...');

      // 1. Configuración
      this.dependencies.config = new ConfigurationManager();
      this.dependencies.config.logConfiguration();

      // 2. Conexión a base de datos
      this.dependencies.databaseConnection = new DatabaseConnection(
        this.dependencies.config.get('database.uri'),
        this.dependencies.config.get('database.name')
      );

      // Intentar conectar a la base de datos
      try {
        const db = await this.dependencies.databaseConnection.connect();
        if (db) {
          await this.dependencies.databaseConnection.ensureIndexes();
          this.dependencies.databaseConnection.setupGracefulShutdown();
        }
      } catch (dbError) {
        console.warn('⚠️ No se pudo conectar a la base de datos, continuando sin persistencia:', dbError.message);
      }

      // 3. Repositorios
      this.dependencies.sessionRepository = new MongoSessionRepository(
        this.dependencies.databaseConnection.getDatabase()
      );

      // TODO: Implementar otros repositorios
      // this.dependencies.userRepository = new MongoUserRepository(db);
      // this.dependencies.moduleRepository = new MongoModuleRepository(db);
      // this.dependencies.analyticsRepository = new MongoAnalyticsRepository(db);

      // 4. Servicios externos
      this.dependencies.whatsappService = new WhatsAppApiService({
        apiToken: this.dependencies.config.get('whatsapp.apiToken'),
        businessPhone: this.dependencies.config.get('whatsapp.businessPhone'),
        apiVersion: this.dependencies.config.get('whatsapp.apiVersion'),
        videoUrls: this.dependencies.config.get('whatsapp.videoUrls')
      });

      // Validar conexión con WhatsApp API
      try {
        await this.dependencies.whatsappService.validateConfig();
        console.log('✅ Configuración de WhatsApp validada');
      } catch (whatsappError) {
        console.warn('⚠️ Error validando WhatsApp API:', whatsappError.message);
      }

      // 5. Servicios de aplicación
      this.dependencies.sessionManagementService = new SessionManagementService(
        this.dependencies.sessionRepository
      );

      // Iniciar limpieza automática de sesiones si está habilitada
      if (this.dependencies.config.get('features.enableCleanupJob')) {
        this.dependencies.sessionManagementService.startAutomaticCleanup(
          this.dependencies.config.get('features.cleanupIntervalMinutes')
        );
        console.log('🧹 Limpieza automática de sesiones iniciada');
      }

      this.initialized = true;
      console.log('✅ Contenedor de dependencias inicializado exitosamente');

    } catch (error) {
      console.error('❌ Error inicializando contenedor de dependencias:', error);
      throw error;
    }
  }

  getDependencies() {
    if (!this.initialized) {
      throw new Error('Contenedor no inicializado. Llama a initialize() primero.');
    }
    return this.dependencies;
  }

  get(dependencyName) {
    if (!this.initialized) {
      throw new Error('Contenedor no inicializado. Llama a initialize() primero.');
    }
    
    const dependency = this.dependencies[dependencyName];
    if (!dependency) {
      throw new Error(`Dependencia '${dependencyName}' no encontrada`);
    }
    
    return dependency;
  }

  async shutdown() {
    try {
      console.log('🛑 Cerrando contenedor de dependencias...');

      // Cerrar conexión de base de datos
      if (this.dependencies.databaseConnection) {
        await this.dependencies.databaseConnection.disconnect();
      }

      // Limpiar sesiones activas
      if (this.dependencies.sessionRepository) {
        await this.dependencies.sessionRepository.cleanupExpiredSessions();
      }

      console.log('✅ Contenedor de dependencias cerrado exitosamente');
    } catch (error) {
      console.error('❌ Error cerrando contenedor de dependencias:', error);
    }
  }

  // Método para testing - permite inyectar mocks
  injectMock(dependencyName, mockDependency) {
    if (!this.initialized) {
      throw new Error('Contenedor no inicializado');
    }
    
    console.log(`🧪 Inyectando mock para '${dependencyName}'`);
    this.dependencies[dependencyName] = mockDependency;
  }

  // Método para obtener información de salud del sistema
  async getHealthStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {}
    };

    try {
      // Verificar base de datos
      status.services.database = {
        status: this.dependencies.databaseConnection?.isConnected() ? 'healthy' : 'disconnected',
        connected: this.dependencies.databaseConnection?.isConnected() || false
      };

      // Verificar WhatsApp API
      try {
        await this.dependencies.whatsappService.testConnection();
        status.services.whatsapp = { status: 'healthy' };
      } catch (error) {
        status.services.whatsapp = { 
          status: 'error', 
          error: error.message 
        };
        status.status = 'degraded';
      }

      // Verificar sesiones activas
      const sessionCount = await this.dependencies.sessionRepository.getSessionCount();
      status.services.sessions = {
        status: 'healthy',
        activeCount: sessionCount
      };

    } catch (error) {
      status.status = 'error';
      status.error = error.message;
    }

    return status;
  }
}