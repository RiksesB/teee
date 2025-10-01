import { UserSession } from '../../domain/entities/UserSession.js';

/**
 * Use Case: Start Course
 * Inicia un nuevo curso para un usuario
 */
export class StartCourseUseCase {
  constructor(sessionRepository, userRepository, whatsappService, analyticsRepository) {
    this.sessionRepository = sessionRepository;
    this.userRepository = userRepository;
    this.whatsappService = whatsappService;
    this.analyticsRepository = analyticsRepository;
  }

  async execute(phoneNumber, useTemplate = false) {
    try {
      // Validar número de teléfono
      if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim() === '') {
        throw new Error(`Número de teléfono inválido: ${phoneNumber}`);
      }

      // Limpiar sesión anterior si existe
      await this.sessionRepository.delete(phoneNumber);

      // Crear nueva sesión
      const session = new UserSession({
        phoneNumber,
        state: 'watching_video',
        currentModule: 1,
        startedAt: new Date(),
        metadata: { useTemplate }
      });

      // Guardar sesión
      await this.sessionRepository.save(session);

      // Guardar datos analíticos
      await this.analyticsRepository.saveUserSession({
        phoneNumber,
        evento: 'inicio_curso',
        useTemplate,
        timestamp: new Date()
      });

      // Enviar mensaje de inicio si es necesario
      if (useTemplate) {
        await this.whatsappService.sendTemplate(
          phoneNumber,
          'iniciar_prueba',
          'es_AR'
        );
      }

      // Enviar video tutorial del primer módulo
      try {
        await this.whatsappService.sendVideoTutorial(phoneNumber, 1);
      } catch (videoError) {
        console.error('Error enviando video tutorial:', videoError);
        // Continuar sin video si falla
      }

      // Programar inicio del formulario después de un delay
      setTimeout(async () => {
        try {
          const startQuizUseCase = new StartQuizUseCase(
            this.sessionRepository,
            this.whatsappService
          );
          await startQuizUseCase.execute(phoneNumber, 1);
        } catch (error) {
          console.error('Error iniciando quiz:', error);
          await this.whatsappService.sendMessage(
            phoneNumber,
            '⚠️ Hubo un problema. Inténtalo de nuevo más tarde.'
          );
        }
      }, 2000);

      return { success: true, message: 'Curso iniciado exitosamente' };

    } catch (error) {
      // Manejar error de ventana de 24 horas
      if (error.message.includes('131047') && !useTemplate) {
        console.log('Error 131047 detectado - Reintentando con plantilla...');
        return this.execute(phoneNumber, true);
      }

      throw error;
    }
  }
}

/**
 * Use Case: Start Quiz
 * Inicia el cuestionario de un módulo específico
 */
export class StartQuizUseCase {
  constructor(sessionRepository, whatsappService, moduleRepository) {
    this.sessionRepository = sessionRepository;
    this.whatsappService = whatsappService;
    this.moduleRepository = moduleRepository;
  }

  async execute(phoneNumber, moduleNumber) {
    try {
      // Obtener sesión actual
      const session = await this.sessionRepository.findByPhoneNumber(phoneNumber);
      if (!session) {
        throw new Error('No se encontró sesión activa');
      }

      // Obtener módulo
      const module = await this.moduleRepository.findByOrder(moduleNumber);
      if (!module) {
        throw new Error(`Módulo ${moduleNumber} no encontrado`);
      }

      // Actualizar sesión
      session.setState('answering_quiz');
      session.currentModule = moduleNumber;
      session.currentQuestion = 0;
      session.answers = [];

      await this.sessionRepository.update(phoneNumber, session);

      // Enviar título del módulo
      await this.whatsappService.sendMessage(phoneNumber, module.title);

      // Enviar primera pregunta después de un delay
      setTimeout(async () => {
        try {
          const sendQuestionUseCase = new SendQuestionUseCase(
            this.sessionRepository,
            this.whatsappService,
            this.moduleRepository
          );
          await sendQuestionUseCase.execute(phoneNumber, 0);
        } catch (error) {
          console.error('Error enviando primera pregunta:', error);
        }
      }, 1500);

      return { success: true };

    } catch (error) {
      console.error('Error iniciando quiz:', error);
      throw error;
    }
  }
}