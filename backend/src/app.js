import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { DependencyContainer } from './shared/DependencyContainer.js';
import { createWhatsAppRoutes } from './presentation/routes/whatsappRoutes.js';
import { createCourseApiRoutes } from './presentation/routes/courseApiRoutes.js';

/**
 * Main Application Class
 * Punto de entrada principal de la aplicación siguiendo Clean Architecture
 */
class NiblionApplication {
  constructor() {
    this.app = express();
    this.container = new DependencyContainer();
    this.server = null;
  }

  async initialize() {
    try {
      console.log('🚀 Iniciando Niblion Application...');

      // 1. Inicializar contenedor de dependencias
      await this.container.initialize();

      // 2. Configurar middleware
      this.setupMiddleware();

      // 3. Configurar rutas
      this.setupRoutes();

      // 4. Configurar manejo de errores
      this.setupErrorHandling();

      // 5. Configurar manejo de cierre graceful
      this.setupGracefulShutdown();

      console.log('✅ Aplicación inicializada exitosamente');

    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);
      process.exit(1);
    }
  }

  setupMiddleware() {
    const config = this.container.get('config');

    // Middleware básico
    this.app.use(express.json());
    this.app.use(cors());

    // Servir archivos estáticos (imágenes, videos)
    this.app.use(express.static('.'));

    // Middleware de logging para desarrollo
    if (config.isDevelopment()) {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }

    console.log('✅ Middleware configurado');
  }

  setupRoutes() {
    const dependencies = this.container.getDependencies();

    // Ruta de salud
    this.app.get('/health', async (req, res) => {
      try {
        const health = await this.container.getHealthStatus();
        const statusCode = health.status === 'healthy' ? 200 : 
                          health.status === 'degraded' ? 200 : 500;
        res.status(statusCode).json(health);
      } catch (error) {
        res.status(500).json({
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Ruta raíz
    this.app.get('/', (req, res) => {
      res.send(`
        <h1>🛡️ Niblion - Security Awareness Platform</h1>
        <p>Sistema de concientización en seguridad digital via WhatsApp</p>
        <ul>
          <li><a href="/health">🏥 Health Check</a></li>
          <li><a href="/api/statistics">📊 Estadísticas</a></li>
        </ul>
        <p><em>Arquitectura Clean - Monolito Modular</em></p>
      `);
    });

    // Rutas de WhatsApp webhook
    this.app.use('/', createWhatsAppRoutes(dependencies));

    // Rutas de API para gestión de cursos
    this.app.use('/api', createCourseApiRoutes(dependencies));

    // Ruta para información de configuración (sanitizada)
    this.app.get('/config', (req, res) => {
      const config = this.container.get('config');
      res.json(config.getSanitizedConfig());
    });

    console.log('✅ Rutas configuradas');
  }

  setupErrorHandling() {
    // Manejo de rutas no encontradas
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });

    // Manejo global de errores
    this.app.use((error, req, res, next) => {
      console.error('❌ Error no manejado:', error);

      const isDevelopment = this.container.get('config').isDevelopment();
      
      res.status(500).json({
        error: 'Error interno del servidor',
        message: isDevelopment ? error.message : 'Algo salió mal',
        stack: isDevelopment ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    });

    // Manejo de promesas rechazadas no capturadas
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Promesa rechazada no manejada:', reason);
      console.error('En la promesa:', promise);
    });

    // Manejo de excepciones no capturadas
    process.on('uncaughtException', (error) => {
      console.error('❌ Excepción no capturada:', error);
      this.shutdown().then(() => process.exit(1));
    });

    console.log('✅ Manejo de errores configurado');
  }

  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      console.log(`\n🛑 Señal ${signal} recibida, cerrando aplicación gracefully...`);
      await this.shutdown();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    console.log('✅ Cierre graceful configurado');
  }

  async start() {
    try {
      const config = this.container.get('config');
      const port = config.get('server.port');

      this.server = this.app.listen(port, () => {
        console.log(`\n🌟 Niblion Application corriendo en puerto: ${port}`);
        console.log(`🌐 Entorno: ${config.get('server.environment')}`);
        console.log(`🔗 Health check: http://localhost:${port}/health`);
        console.log(`📊 Estadísticas: http://localhost:${port}/api/statistics`);
        
        const videoUrls = config.get('whatsapp.videoUrls');
        console.log('\n📹 URLs de videos configuradas:');
        Object.entries(videoUrls).forEach(([modulo, url]) => {
          console.log(`   Módulo ${modulo}: ${url}`);
        });
        
        console.log('\n✅ Aplicación lista para recibir webhooks de WhatsApp');
      });

    } catch (error) {
      console.error('❌ Error iniciando servidor:', error);
      throw error;
    }
  }

  async shutdown() {
    try {
      console.log('🛑 Cerrando aplicación...');

      // Cerrar servidor HTTP
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(() => {
            console.log('✅ Servidor HTTP cerrado');
            resolve();
          });
        });
      }

      // Cerrar contenedor de dependencias
      await this.container.shutdown();

      console.log('✅ Aplicación cerrada exitosamente');

    } catch (error) {
      console.error('❌ Error cerrando aplicación:', error);
    }
  }
}

// Función principal para iniciar la aplicación
async function main() {
  console.log('🚀 Iniciando aplicación Niblion...');
  const app = new NiblionApplication();
  
  try {
    console.log('📦 Inicializando dependencias...');
    await app.initialize();
    console.log('🎯 Iniciando servidor...');
    await app.start();
  } catch (error) {
    console.error('❌ Error fatal iniciando aplicación:', error);
    process.exit(1);
  }
}

// Iniciar aplicación
main().catch(error => {
  console.error('❌ Error no manejado en main():', error);
  process.exit(1);
});

export { NiblionApplication };