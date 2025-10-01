import { SendQuestionUseCase } from './SendQuestionUseCase.js';

/**
 * Use Case: Process Answer
 * Procesa la respuesta del usuario a una pregunta
 */
export class ProcessAnswerUseCase {
  constructor(sessionRepository, whatsappService, moduleRepository, analyticsRepository) {
    this.sessionRepository = sessionRepository;
    this.whatsappService = whatsappService;
    this.moduleRepository = moduleRepository;
    this.analyticsRepository = analyticsRepository;
  }

  async execute(phoneNumber, selectedOption) {
    try {
      // Obtener sesión actual
      const session = await this.sessionRepository.findByPhoneNumber(phoneNumber);
      if (!session || session.state !== 'answering_quiz') {
        throw new Error('No hay un cuestionario activo');
      }

      // Obtener módulo y pregunta actual
      const module = await this.moduleRepository.findByOrder(session.currentModule);
      const question = module.questions[session.currentQuestion];

      if (!question) {
        throw new Error('Pregunta no encontrada');
      }

      // Validar respuesta
      const isCorrect = question.isCorrectAnswer(selectedOption);
      
      // Agregar respuesta a la sesión
      session.addAnswer(question.number, selectedOption, isCorrect);

      // Obtener retroalimentación
      const feedback = question.getFeedback(selectedOption);
      
      // Enviar retroalimentación
      if (feedback) {
        await this.whatsappService.sendMessage(phoneNumber, feedback);
      }

      // Avanzar a la siguiente pregunta
      session.nextQuestion();
      await this.sessionRepository.update(phoneNumber, session);

      // Verificar si hay más preguntas en el módulo
      if (session.currentQuestion < module.getTotalQuestions()) {
        // Enviar siguiente pregunta después de un delay
        setTimeout(async () => {
          try {
            const sendQuestionUseCase = new SendQuestionUseCase(
              this.sessionRepository,
              this.whatsappService,
              this.moduleRepository
            );
            await sendQuestionUseCase.execute(phoneNumber, session.currentQuestion);
          } catch (error) {
            console.error('Error enviando siguiente pregunta:', error);
          }
        }, 2000);

        return { success: true, hasMoreQuestions: true };
      } else {
        // Módulo completado
        return await this.completeModule(session, module);
      }

    } catch (error) {
      console.error('Error procesando respuesta:', error);
      throw error;
    }
  }

  async completeModule(session, module) {
    try {
      // Calcular resultado del módulo
      const score = module.calculateScore(session.answers);
      
      const moduleResult = {
        module: session.currentModule,
        title: module.title,
        correctAnswers: score.correct,
        totalQuestions: score.total,
        percentage: score.percentage,
        completedAt: new Date(),
        answers: session.answers
      };

      // Completar módulo en la sesión
      session.completeModule(moduleResult);
      await this.sessionRepository.update(session.phoneNumber, session);

      // Guardar resultado en analytics
      await this.analyticsRepository.saveQuizResponse(
        session.phoneNumber,
        session.currentModule - 1, // Ya se incrementó en completeModule
        {
          moduleResult,
          detailedAnswers: session.answers,
          completedAt: new Date()
        }
      );

      // Generar mensaje de resultado
      const resultMessage = this.generateModuleResultMessage(moduleResult);
      await this.whatsappService.sendMessage(session.phoneNumber, resultMessage);

      // Verificar si hay más módulos
      if (session.currentModule <= 6) {
        // Continuar con el siguiente módulo
        setTimeout(async () => {
          try {
            await this.startNextModule(session);
          } catch (error) {
            console.error('Error iniciando siguiente módulo:', error);
          }
        }, 3000);

        return { success: true, moduleCompleted: true, hasMoreModules: true };
      } else {
        // Curso completado
        return await this.completeCourse(session);
      }

    } catch (error) {
      console.error('Error completando módulo:', error);
      throw error;
    }
  }

  async startNextModule(session) {
    // Enviar video del siguiente módulo
    try {
      await this.whatsappService.sendVideoTutorial(session.phoneNumber, session.currentModule);
    } catch (videoError) {
      console.error('Error enviando video:', videoError);
    }

    // Iniciar quiz del siguiente módulo
    setTimeout(async () => {
      try {
        const startQuizUseCase = new (await import('./StartCourseUseCase.js')).StartQuizUseCase(
          this.sessionRepository,
          this.whatsappService,
          this.moduleRepository
        );
        await startQuizUseCase.execute(session.phoneNumber, session.currentModule);
      } catch (error) {
        console.error('Error iniciando siguiente quiz:', error);
      }
    }, 2000);
  }

  async completeCourse(session) {
    // Generar mensaje final
    const finalMessage = this.generateFinalMessage(session.moduleResults);
    await this.whatsappService.sendMessage(session.phoneNumber, finalMessage);

    // Enviar certificado
    setTimeout(async () => {
      try {
        await this.sendCertificateAndSurvey(session);
      } catch (error) {
        console.error('Error enviando certificado:', error);
      }
    }, 2000);

    return { success: true, courseCompleted: true };
  }

  async sendCertificateAndSurvey(session) {
    // Enviar certificado
    const certificateUrl = 'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/Certificado-curso-Phishing.jpg';
    await this.whatsappService.sendImage(
      session.phoneNumber,
      certificateUrl,
      '🎉 ¡Felicitaciones! Has completado el curso de Concientización en Seguridad Digital.'
    );

    // Iniciar encuesta de satisfacción
    setTimeout(async () => {
      const startSurveyUseCase = new (await import('./StartSurveyUseCase.js')).StartSurveyUseCase(
        this.sessionRepository,
        this.whatsappService
      );
      await startSurveyUseCase.execute(session.phoneNumber);
    }, 3000);
  }

  generateModuleResultMessage(moduleResult) {
    let message = `🎉 ¡${moduleResult.title} completado!\n\n`;
    message += `📊 Resultado: ${moduleResult.correctAnswers}/${moduleResult.totalQuestions} respuestas correctas (${moduleResult.percentage.toFixed(1)}%)\n\n`;

    if (moduleResult.percentage >= 80) {
      message += `🏆 ¡Excelente! Has dominado este módulo.`;
    } else if (moduleResult.percentage >= 60) {
      message += `👍 ¡Bien hecho! Tienes una buena base en este tema.`;
    } else {
      message += `📚 Es importante reforzar estos conceptos.`;
    }

    if (moduleResult.module < 6) {
      message += `\n\n🎬 Continuemos con el siguiente módulo...`;
    }

    return message;
  }

  generateFinalMessage(moduleResults) {
    let message = `🎉 ¡Felicitaciones! 🎉\n\n`;
    message += `Has completado con éxito los 6 módulos del curso de Concientización en Seguridad Digital.\n\n`;
    message += `📊 **Resumen de tus resultados:**\n\n`;

    let totalCorrect = 0;
    let totalQuestions = 0;

    moduleResults.forEach((result, index) => {
      message += `${index + 1}. ${result.title.replace('✅ ', '')}\n`;
      message += `   📈 ${result.correctAnswers}/${result.totalQuestions} (${result.percentage.toFixed(1)}%)\n\n`;
      totalCorrect += result.correctAnswers;
      totalQuestions += result.totalQuestions;
    });

    const totalPercentage = (totalCorrect / totalQuestions) * 100;
    message += `🏆 **Puntuación total: ${totalCorrect}/${totalQuestions} (${totalPercentage.toFixed(1)}%)**\n\n`;
    message += `¡Estás listo para defenderte de las amenazas cibernéticas! 🛡️💻`;

    return message;
  }
}