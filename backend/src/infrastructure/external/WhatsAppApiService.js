import axios from 'axios';
import { WhatsAppService } from '../../application/services/WhatsAppService.js';

/**
 * Infrastructure: WhatsApp API Implementation
 */
export class WhatsAppApiService extends WhatsAppService {
  constructor(config) {
    super();
    this.apiToken = config.apiToken;
    this.businessPhone = config.businessPhone;
    this.apiVersion = config.apiVersion || 'v21.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}`;
    
    // URLs de videos por módulo
    this.videoUrls = config.videoUrls || {
      1: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo1.mp4",
      2: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo2.mp4",
      3: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo3.mp4",
      4: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo4.mp4",
      5: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo5.mp4",
      6: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo6.mp4",
    };
  }

  async sendMessage(phoneNumber, message) {
    try {
      const response = await axios({
        method: "POST",
        url: `${this.baseUrl}/messages`,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: phoneNumber,
          text: { body: message },
        },
      });
      
      console.log(`📤 Mensaje enviado a ${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error enviando mensaje:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendTemplate(phoneNumber, templateName = "hello_world", language = "es", parameters = []) {
    try {
      const data = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: language,
          },
        },
      };

      // Agregar parámetros si existen
      if (parameters.length > 0) {
        data.template.components = [
          {
            type: "body",
            parameters: parameters.map((param) => ({
              type: "text",
              text: param,
            })),
          },
        ];
      }

      const response = await axios({
        method: "POST",
        url: `${this.baseUrl}/messages`,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: data,
      });

      console.log(`📨 Plantilla '${templateName}' enviada a ${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error enviando plantilla:', error.response?.data || error);
      throw error;
    }
  }

  async sendInteractiveMessage(phoneNumber, message, buttons) {
    try {
      await axios({
        method: "POST",
        url: `${this.baseUrl}/messages`,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "interactive",
          interactive: {
            type: "button",
            body: {
              text: message,
            },
            action: {
              buttons: buttons,
            },
          },
        },
      });
      
      console.log(`🔘 Mensaje interactivo enviado a ${phoneNumber}`);
    } catch (error) {
      console.error('Error enviando mensaje interactivo:', error.response?.data || error.message);
      
      // Fallback: enviar como texto si los botones fallan
      try {
        const fallbackMessage = message + "\n\n💡 Responde con: A, B o C";
        await this.sendMessage(phoneNumber, fallbackMessage);
      } catch (fallbackError) {
        console.error('Error en fallback de texto:', fallbackError);
        throw fallbackError;
      }
    }
  }

  async sendVideo(phoneNumber, videoUrl, caption = "") {
    try {
      const response = await axios({
        method: "POST",
        url: `${this.baseUrl}/messages`,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "video",
          video: {
            link: videoUrl,
            caption: caption,
          },
        },
      });
      
      console.log(`🎬 Video enviado a ${phoneNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error enviando video:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendImage(phoneNumber, imageUrl, caption = "") {
    try {
      await axios({
        method: "POST",
        url: `${this.baseUrl}/messages`,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "image",
          image: {
            link: imageUrl,
            caption: caption,
          },
        },
      });
      
      console.log(`🖼️ Imagen enviada a ${phoneNumber}`);
    } catch (error) {
      console.error('Error enviando imagen:', error);
      throw error;
    }
  }

  async markAsRead(messageId) {
    try {
      await axios({
        method: "POST",
        url: `${this.baseUrl}/messages`,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        },
      });
    } catch (error) {
      console.error('Error marcando como leído:', error);
    }
  }

  async sendVideoTutorial(phoneNumber, moduleNumber) {
    const videoUrl = this.videoUrls[moduleNumber];
    if (!videoUrl) {
      throw new Error(`Video para módulo ${moduleNumber} no encontrado`);
    }

    const caption = 
      `🎬 Video Tutorial - Módulo ${moduleNumber}\n\n` +
      `📹 Te recomendamos ver este video para aprender sobre el tema.\n\n` +
      `💡 Puedes continuar con las preguntas cuando quieras.`;

    try {
      // Intentar enviar el video
      await this.sendVideo(phoneNumber, videoUrl, caption);
      console.log(`Video del módulo ${moduleNumber} enviado exitosamente`);
    } catch (error) {
      console.error('Error enviando video, usando fallback:', error);
      
      // Fallback: enviar mensaje de texto con enlace
      const fallbackMessage = 
        `🎬 Video Tutorial - Módulo ${moduleNumber}\n\n` +
        `📹 Puedes ver el video en: ${videoUrl}\n\n` +
        `💡 Te recomendamos verlo para aprender sobre el tema.`;
      
      await this.sendMessage(phoneNumber, fallbackMessage);
    }
  }

  // Métodos de utilidad
  getVideoUrl(moduleNumber) {
    return this.videoUrls[moduleNumber];
  }

  setVideoUrl(moduleNumber, url) {
    this.videoUrls[moduleNumber] = url;
  }

  // Validación de configuración
  validateConfig() {
    if (!this.apiToken) {
      throw new Error('API_TOKEN es requerido');
    }
    if (!this.businessPhone) {
      throw new Error('BUSINESS_PHONE es requerido');
    }
    return true;
  }

  // Método para probar la conexión
  async testConnection() {
    try {
      const response = await axios({
        method: "GET",
        url: `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}`,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });
      
      console.log('✅ Conexión con WhatsApp API verificada');
      return response.data;
    } catch (error) {
      console.error('❌ Error verificando conexión con WhatsApp API:', error.response?.data || error.message);
      throw error;
    }
  }
}