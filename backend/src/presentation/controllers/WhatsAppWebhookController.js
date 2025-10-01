import { StartCourseUseCase } from '../../application/use-cases/StartCourseUseCase.js';
import { ProcessAnswerUseCase } from '../../application/use-cases/ProcessAnswerUseCase.js';

/**
 * Controller: WhatsApp Webhook Controller
 * Maneja los webhooks entrantes de WhatsApp
 */
export class WhatsAppWebhookController {
  constructor(dependencies) {
    this.sessionRepository = dependencies.sessionRepository;
    this.userRepository = dependencies.userRepository;
    this.moduleRepository = dependencies.moduleRepository;
    this.analyticsRepository = dependencies.analyticsRepository;
    this.whatsappService = dependencies.whatsappService;
    this.sessionManagementService = dependencies.sessionManagementService;
  }

  async handleWebhook(req, res) {
    try {
      console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2));

      // Verificar si el webhook contiene un mensaje
      const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

      if (!message || !['text', 'interactive', 'button'].includes(message.type)) {
        return res.sendStatus(200);
      }

      const phoneNumber = message.from;
      const { messageText, isFormResponse, isSurveyResponse } = this.parseMessage(message);

      let response = null;

      // Procesar diferentes tipos de mensajes
      if (isFormResponse) {
        response = await this.handleQuizResponse(phoneNumber, message);
      } else if (isSurveyResponse) {
        response = await this.handleSurveyResponse(phoneNumber, message);
      } else {
        response = await this.handleTextCommand(phoneNumber, messageText, message);
      }

      // Enviar respuesta si existe
      if (response) {
        await this.whatsappService.sendMessage(phoneNumber, response);
      }

      // Marcar mensaje como leído
      await this.whatsappService.markAsRead(message.id);

      res.sendStatus(200);
    } catch (error) {
      console.error('Error en webhook:', error);
      res.sendStatus(500);
    }
  }

  parseMessage(message) {
    let messageText = '';
    let isFormResponse = false;
    let isSurveyResponse = false;

    if (message.type === 'text') {
      messageText = message.text.body.toLowerCase().trim();
    } else if (message.type === 'button') {
      // Manejar botones de plantilla
      const payload = message.button?.payload || message.button?.text || '';
      messageText = payload.toLowerCase();
    } else if (message.type === 'interactive') {
      const buttonId = message.interactive.button_reply?.id;
      
      if (buttonId?.startsWith('respuesta_')) {
        isFormResponse = true;
      } else if (this.isSurveyButtonId(buttonId)) {
        isSurveyResponse = true;
      } else {
        messageText = this.mapInteractiveButtonToCommand(buttonId);
      }
    }

    return { messageText, isFormResponse, isSurveyResponse };
  }

  isSurveyButtonId(buttonId) {
    return buttonId && (
      buttonId.includes('duracion_') ||
      buttonId.includes('comprension_') ||
      buttonId.includes('dinamica_') ||
      buttonId.includes('utilidad_') ||
      buttonId.includes('recomendacion_')
    );
  }

  mapInteractiveButtonToCommand(buttonId) {
    const buttonMap = {
      'iniciar_si': 'comenzar',
      'iniciar_no': 'no_iniciar'
    };
    return buttonMap[buttonId] || '';
  }

  async handleQuizResponse(phoneNumber, message) {
    try {
      const session = await this.sessionManagementService.getActiveSession(phoneNumber);
      if (!session || session.state !== 'answering_quiz') {
        return 'No tienes un cuestionario activo. Escribe "prueba" para comenzar.';
      }

      // Extraer respuesta seleccionada
      let selectedOption;
      if (message.type === 'interactive') {
        const buttonId = message.interactive.button_reply.id;
        const parts = buttonId.split('_');
        selectedOption = parts[1]?.toUpperCase(); // 'a' -> 'A'
      } else if (message.type === 'text') {
        const text = message.text.body.trim().toLowerCase();
        selectedOption = ['a', 'b', 'c'].includes(text) ? text.toUpperCase() : null;
      }

      if (!selectedOption) {
        return 'Por favor, selecciona una opción válida (A, B o C).';
      }

      // Procesar respuesta
      const processAnswerUseCase = new ProcessAnswerUseCase(
        this.sessionRepository,
        this.whatsappService,
        this.moduleRepository,
        this.analyticsRepository
      );

      await processAnswerUseCase.execute(phoneNumber, selectedOption);
      return null; // No enviar respuesta adicional

    } catch (error) {
      console.error('Error procesando respuesta de quiz:', error);
      return 'Hubo un error procesando tu respuesta. Inténtalo de nuevo.';
    }
  }

  async handleSurveyResponse(phoneNumber, message) {
    try {
      // Implementar lógica de encuesta similar al código original
      // Por simplicidad, retornamos una respuesta básica aquí
      return 'Gracias por tu respuesta a la encuesta.';
    } catch (error) {
      console.error('Error procesando respuesta de encuesta:', error);
      return 'Hubo un error procesando tu respuesta de encuesta.';
    }
  }

  async handleTextCommand(phoneNumber, messageText, originalMessage) {
    try {
      const session = await this.sessionManagementService.getActiveSession(phoneNumber);

      switch (messageText) {
        case 'prueba':
          return await this.startCourse(phoneNumber);

        case 'comenzar':
          if (!session) {
            return await this.startCourse(phoneNumber);
          } else if (['watching_video', 'idle'].includes(session.state)) {
            // Continuar con el quiz
            const startQuizUseCase = new (await import('../../application/use-cases/StartCourseUseCase.js')).StartQuizUseCase(
              this.sessionRepository,
              this.whatsappService,
              this.moduleRepository
            );
            await startQuizUseCase.execute(phoneNumber, session.currentModule);
            return null;
          } else {
            return 'Ya tienes un curso en progreso. Continúa respondiendo las preguntas.';
          }

        case 'salir':
          return await this.exitCourse(phoneNumber);

        case 'no_iniciar':
          await this.sessionManagementService.endSession(phoneNumber);
          return 'Está bien, puedes iniciar el curso cuando quieras escribiendo "prueba".';

        case 'einsertaremoji':
          await this.whatsappService.sendImage(
            phoneNumber,
            'https://i.chzbgr.com/full/6796713984/hF30B7124/furry-query',
            '😂 eINSERTAREMOJI'
          );
          return null;

        default:
          // Verificar si está en un formulario o encuesta activos
          if (session) {
            if (session.state === 'answering_quiz') {
              return await this.handleQuizResponse(phoneNumber, originalMessage);
            } else if (session.state === 'in_survey') {
              return await this.handleSurveyResponse(phoneNumber, originalMessage);
            }
          }

          // Respuesta echo por defecto
          return this.generateEchoResponse(messageText);
      }
    } catch (error) {
      console.error('Error manejando comando:', error);
      return 'Hubo un error procesando tu solicitud. Inténtalo de nuevo.';
    }
  }

  async startCourse(phoneNumber) {
    try {
      const startCourseUseCase = new StartCourseUseCase(
        this.sessionRepository,
        this.userRepository,
        this.whatsappService,
        this.analyticsRepository
      );

      await startCourseUseCase.execute(phoneNumber);
      return null; // No enviar respuesta adicional
    } catch (error) {
      console.error('Error iniciando curso:', error);
      return 'Hubo un error iniciando el curso. Inténtalo de nuevo.';
    }
  }

  async exitCourse(phoneNumber) {
    try {
      const session = await this.sessionManagementService.getActiveSession(phoneNumber);
      
      if (session && ['answering_quiz', 'watching_video', 'in_survey'].includes(session.state)) {
        const progress = session.generateProgressSummary();
        await this.sessionManagementService.endSession(phoneNumber);
        
        return this.generateProgressSummary(progress);
      } else {
        return 'No hay ningún curso activo. Escribe "prueba" para comenzar.';
      }
    } catch (error) {
      console.error('Error saliendo del curso:', error);
      return 'Hubo un error. Inténtalo de nuevo.';
    }
  }

  generateProgressSummary(progress) {
    let message = `📊 **Resumen de tu progreso:**\n\n`;
    
    if (progress.results.length > 0) {
      message += `**Módulos completados:**\n`;
      progress.results.forEach((result, index) => {
        message += `${index + 1}. Módulo ${result.module}\n`;
        message += `   📈 Puntuación: ${result.score.toFixed(1)}%\n\n`;
      });
    } else {
      message += `**Módulos completados:** Ninguno\n\n`;
    }
    
    if (progress.currentModule <= 6) {
      message += `**Módulo actual:** ${progress.currentModule}\n\n`;
    }
    
    message += `¡Puedes continuar cuando quieras escribiendo "prueba"! 😊`;
    
    return message;
  }

  generateEchoResponse(messageText) {
    return `Echo: ${messageText}\n\n💡 Tip: Escribe "prueba" para iniciar el curso de seguridad digital.\n📤 Escribe "salir" en cualquier momento para abandonar el curso.`;
  }

  // Método para verificar webhook (GET)
  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const expectedToken = process.env.WEBHOOK_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === expectedToken) {
      console.log('✅ Webhook verificado exitosamente!');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Verificación de webhook fallida');
      res.sendStatus(403);
    }
  }
}