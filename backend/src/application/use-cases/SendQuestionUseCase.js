/**
 * Use Case: Send Question
 * Envía una pregunta específica del módulo actual
 */
export class SendQuestionUseCase {
  constructor(sessionRepository, whatsappService, moduleRepository) {
    this.sessionRepository = sessionRepository;
    this.whatsappService = whatsappService;
    this.moduleRepository = moduleRepository;
  }

  async execute(phoneNumber, questionIndex) {
    try {
      // Obtener sesión actual
      const session = await this.sessionRepository.findByPhoneNumber(phoneNumber);
      if (!session) {
        throw new Error('No se encontró sesión activa');
      }

      // Obtener módulo actual
      const module = await this.moduleRepository.findByOrder(session.currentModule);
      if (!module || !module.questions[questionIndex]) {
        throw new Error('Pregunta no encontrada');
      }

      const question = module.questions[questionIndex];

      // Formatear mensaje para WhatsApp
      const message = question.formatForWhatsApp();
      const buttons = question.createWhatsAppButtons();

      // Enviar pregunta con botones
      await this.whatsappService.sendInteractiveMessage(phoneNumber, message, buttons);

      return { success: true };

    } catch (error) {
      console.error('Error enviando pregunta:', error);
      
      // Fallback: enviar como texto simple
      try {
        const session = await this.sessionRepository.findByPhoneNumber(phoneNumber);
        const module = await this.moduleRepository.findByOrder(session.currentModule);
        const question = module.questions[questionIndex];
        
        const fallbackMessage = question.formatForWhatsApp() + '\n\n💡 Responde con: A, B o C';
        await this.whatsappService.sendMessage(phoneNumber, fallbackMessage);
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        throw fallbackError;
      }
    }
  }
}