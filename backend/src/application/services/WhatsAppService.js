/**
 * Service: WhatsApp Service Interface
 * Define los métodos para interactuar con la API de WhatsApp
 */
export class WhatsAppService {
  async sendMessage(phoneNumber, message) {
    throw new Error('Method not implemented');
  }

  async sendTemplate(phoneNumber, templateName, language, parameters = []) {
    throw new Error('Method not implemented');
  }

  async sendInteractiveMessage(phoneNumber, message, buttons) {
    throw new Error('Method not implemented');
  }

  async sendVideo(phoneNumber, videoUrl, caption = '') {
    throw new Error('Method not implemented');
  }

  async sendImage(phoneNumber, imageUrl, caption = '') {
    throw new Error('Method not implemented');
  }

  async markAsRead(messageId) {
    throw new Error('Method not implemented');
  }

  async sendVideoTutorial(phoneNumber, moduleNumber) {
    throw new Error('Method not implemented');
  }
}