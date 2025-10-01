import { StartCourseUseCase } from '../../application/use-cases/StartCourseUseCase.js';

/**
 * Controller: Course Management API Controller
 * Maneja las operaciones de gestión del curso vía API
 */
export class CourseApiController {
  constructor(dependencies) {
    this.sessionRepository = dependencies.sessionRepository;
    this.userRepository = dependencies.userRepository;
    this.moduleRepository = dependencies.moduleRepository;
    this.analyticsRepository = dependencies.analyticsRepository;
    this.whatsappService = dependencies.whatsappService;
    this.sessionManagementService = dependencies.sessionManagementService;
  }

  async startCourse(req, res) {
    try {
      const { numero, numeros, usarPlantilla = false } = req.body;

      // Determinar números a procesar
      let phoneNumbers = [];
      if (numeros && Array.isArray(numeros)) {
        phoneNumbers = numeros.filter(n => n && typeof n === 'string');
      } else if (numero && typeof numero === 'string') {
        phoneNumbers = [numero];
      } else {
        return res.status(400).json({
          error: 'Se requiere "numero" (string) o "numeros" (array de strings)',
          ejemplo: {
            opcion1: { numero: "584121234567" },
            opcion2: { numeros: ["584121234567", "584129876543"] },
            opcion3: { numero: "584121234567", usarPlantilla: true }
          }
        });
      }

      // Eliminar duplicados
      phoneNumbers = [...new Set(phoneNumbers)];

      if (phoneNumbers.length === 0) {
        return res.status(400).json({
          error: 'No se proporcionaron números válidos'
        });
      }

      // Procesar en lotes
      const results = [];
      const errors = [];
      const BATCH_SIZE = 5;

      for (let i = 0; i < phoneNumbers.length; i += BATCH_SIZE) {
        const batch = phoneNumbers.slice(i, i + BATCH_SIZE);
        
        const batchPromises = batch.map(async (phoneNumber) => {
          try {
            const startCourseUseCase = new StartCourseUseCase(
              this.sessionRepository,
              this.userRepository,
              this.whatsappService,
              this.analyticsRepository
            );

            await startCourseUseCase.execute(phoneNumber, usarPlantilla);

            return {
              phoneNumber,
              status: 'success',
              message: usarPlantilla ? 'Curso iniciado con plantilla' : 'Curso iniciado exitosamente',
              method: usarPlantilla ? 'plantilla' : 'mensaje_directo',
              timestamp: new Date().toISOString()
            };
          } catch (error) {
            console.error(`Error iniciando curso para ${phoneNumber}:`, error.message);
            
            return {
              phoneNumber,
              status: 'error',
              message: error.message || 'Error desconocido',
              timestamp: new Date().toISOString()
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach(result => {
          if (result.status === 'success') {
            results.push(result);
          } else {
            errors.push(result);
          }
        });

        // Pausa entre lotes
        if (i + BATCH_SIZE < phoneNumbers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const response = {
        success: errors.length === 0,
        message: `Cursos iniciados: ${results.length} exitosos, ${errors.length} con errores`,
        totalProcessed: phoneNumbers.length,
        results: results
      };

      if (errors.length > 0) {
        response.errors = errors;
      }

      res.status(200).json(response);

    } catch (error) {
      console.error('Error en endpoint iniciar curso:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  }

  async sendTemplate(req, res) {
    try {
      const { numero, numeros, templateName, language = 'es_AR', parameters = [] } = req.body;

      let phoneNumbers = [];
      if (numeros && Array.isArray(numeros)) {
        phoneNumbers = numeros.filter(n => n && typeof n === 'string');
      } else if (numero && typeof numero === 'string') {
        phoneNumbers = [numero];
      } else {
        return res.status(400).json({
          error: 'Se requiere "numero" o "numeros"'
        });
      }

      if (!templateName) {
        return res.status(400).json({
          error: 'Se requiere "templateName"'
        });
      }

      const results = [];
      const errors = [];

      for (const phoneNumber of phoneNumbers) {
        try {
          await this.whatsappService.sendTemplate(phoneNumber, templateName, language, parameters);
          results.push({
            phoneNumber,
            status: 'success',
            message: `Plantilla '${templateName}' enviada exitosamente`
          });
        } catch (error) {
          errors.push({
            phoneNumber,
            status: 'error',
            message: error.message
          });
        }
      }

      res.status(200).json({
        success: errors.length === 0,
        message: `Plantillas enviadas: ${results.length} exitosas, ${errors.length} con errores`,
        results,
        errors: errors.length > 0 ? errors : undefined
      });

    } catch (error) {
      console.error('Error enviando plantillas:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  }

  async getSessionStatistics(req, res) {
    try {
      const stats = await this.sessionManagementService.getAllActiveSessions();
      
      const summary = {
        totalActiveSessions: stats.length,
        byState: {},
        byModule: {},
        averageProgress: 0
      };

      let totalProgress = 0;

      stats.forEach(session => {
        summary.byState[session.state] = (summary.byState[session.state] || 0) + 1;
        summary.byModule[session.currentModule] = (summary.byModule[session.currentModule] || 0) + 1;
        totalProgress += (session.moduleResults.length / 6) * 100;
      });

      summary.averageProgress = stats.length > 0 ? totalProgress / stats.length : 0;

      res.status(200).json(summary);

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        error: 'Error obteniendo estadísticas',
        details: error.message
      });
    }
  }

  async getUserProgress(req, res) {
    try {
      const { phoneNumber } = req.params;
      
      if (!phoneNumber) {
        return res.status(400).json({
          error: 'phoneNumber es requerido'
        });
      }

      const progress = await this.sessionManagementService.getSessionProgress(phoneNumber);
      
      if (!progress) {
        return res.status(404).json({
          error: 'Usuario no encontrado o sin sesión activa'
        });
      }

      res.status(200).json(progress);

    } catch (error) {
      console.error('Error obteniendo progreso del usuario:', error);
      res.status(500).json({
        error: 'Error obteniendo progreso',
        details: error.message
      });
    }
  }

  async cleanupSessions(req, res) {
    try {
      const cleanedCount = await this.sessionManagementService.cleanupExpiredSessions();
      
      res.status(200).json({
        success: true,
        message: `${cleanedCount} sesiones expiradas limpiadas`,
        cleanedCount
      });

    } catch (error) {
      console.error('Error limpiando sesiones:', error);
      res.status(500).json({
        error: 'Error limpiando sesiones',
        details: error.message
      });
    }
  }
}