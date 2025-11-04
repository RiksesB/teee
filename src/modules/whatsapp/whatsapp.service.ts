import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/**
 * Servicio para manejar toda la lógica de WhatsApp Business API
 * Migrado de secure-fortress-06743/index.js
 */
@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly apiToken: string;
  private readonly businessPhone: string;
  private readonly apiVersion: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiToken = this.configService.get<string>('whatsapp.apiToken') || '';
    this.businessPhone = this.configService.get<string>('whatsapp.businessPhone') || '';
    this.apiVersion = this.configService.get<string>('whatsapp.apiVersion') || 'v22.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}/messages`;
  }

  /**
   * Enviar mensaje de texto simple
   */
  async enviarMensaje(numeroDestino: string, texto: string): Promise<any> {
    try {
      const response = await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to: numeroDestino,
          text: { body: texto },
        },
      });
      this.logger.log(`📤 Mensaje enviado a ${numeroDestino}: ${texto.substring(0, 50)}...`);
      return response.data;
    } catch (error) {
      this.logger.error(
        'Error enviando mensaje:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Enviar video
   */
  async enviarVideo(
    numeroDestino: string,
    videoUrl: string,
    caption: string = '',
  ): Promise<any> {
    try {
      const response = await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to: numeroDestino,
          type: 'video',
          video: {
            link: videoUrl,
            caption: caption,
          },
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(
        'Error enviando video:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Enviar imagen (para certificados)
   */
  async enviarImagen(
    numeroDestino: string,
    imagenPath: string,
    caption: string = '',
  ): Promise<void> {
    try {
      await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to: numeroDestino,
          type: 'image',
          image: {
            link: imagenPath,
            caption: caption,
          },
        },
      });
    } catch (error) {
      this.logger.error('Error enviando imagen:', error);
    }
  }

  /**
   * Marcar mensaje como leído
   */
  async marcarComoLeido(messageId: string): Promise<void> {
    try {
      await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
      });
    } catch (error) {
      this.logger.error('Error marcando como leído:', error);
    }
  }

  /**
   * Enviar botones simples (máximo 2 botones)
   */
  async enviarBotonesSimples(
    numeroDestino: string,
    texto: string,
    botones: any[],
  ): Promise<void> {
    try {
      await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to: numeroDestino,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: texto,
            },
            action: {
              buttons: botones,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('Error enviando botones simples:', error);
    }
  }

  /**
   * Enviar botones de opciones (A, B, C)
   */
  async enviarBotonesOpciones(
    numeroDestino: string,
    texto: string,
    botones: any[],
  ): Promise<void> {
    try {
      await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to: numeroDestino,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: texto,
            },
            action: {
              buttons: botones,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        'Error enviando botones de opciones:',
        error.response?.data || error.message,
      );
      // Fallback: enviar como texto si los botones fallan
      try {
        const textoFallback = texto + '\n\n💡 Responde con: A, B o C';
        await this.enviarMensaje(numeroDestino, textoFallback);
      } catch (fallbackError) {
        this.logger.error('Error en fallback de texto:', fallbackError);
      }
    }
  }

  /**
   * Enviar pregunta con lista (para 4+ opciones)
   */
  async enviarPreguntaConLista(
    numeroDestino: string,
    texto: string,
    opciones: string[],
    header: string = 'Pregunta',
    footer: string = '💡 Selecciona tu respuesta',
  ): Promise<void> {
    try {
      // Convertir opciones en formato de lista
      const rows = opciones.map((opcion, index) => {
        const letra = String.fromCharCode(65 + index); // A, B, C, D, E...
        return {
          id: `respuesta_${letra}`,
          title: letra,
          description: opcion.substring(0, 72), // WhatsApp limit: 72 chars
        };
      });

      await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to: numeroDestino,
          type: 'interactive',
          interactive: {
            type: 'list',
            header: {
              type: 'text',
              text: header,
            },
            body: {
              text: texto,
            },
            footer: {
              text: footer,
            },
            action: {
              button: 'Ver opciones',
              sections: [
                {
                  title: 'Respuestas',
                  rows: rows,
                },
              ],
            },
          },
        },
      });

      this.logger.log(
        `✅ Lista enviada con ${opciones.length} opciones para usuario ${numeroDestino}`,
      );
    } catch (error) {
      this.logger.error(
        'Error enviando pregunta con lista:',
        error.response?.data || error.message,
      );
      // Fallback: enviar como texto
      try {
        let textoFallback = texto + '\n\n';
        opciones.forEach((opcion, index) => {
          textoFallback += `${String.fromCharCode(65 + index)}) ${opcion}\n`;
        });
        textoFallback += '\n💡 Responde con la letra de tu opción';
        await this.enviarMensaje(numeroDestino, textoFallback);
      } catch (fallbackError) {
        this.logger.error('Error en fallback de texto:', fallbackError);
      }
    }
  }

  /**
   * Enviar mensaje de plantilla (template message)
   */
  async enviarMensajePlantilla(
    numeroDestino: string,
    nombrePlantilla: string,
    idioma: string = 'es_AR',
    parametros: string[] = [],
  ): Promise<any> {
    try {
      const data: any = {
        messaging_product: 'whatsapp',
        to: numeroDestino,
        type: 'template',
        template: {
          name: nombrePlantilla,
          language: {
            code: idioma,
          },
        },
      };

      // Agregar parámetros si existen
      if (parametros.length > 0) {
        data.template.components = [
          {
            type: 'body',
            parameters: parametros.map((param) => ({
              type: 'text',
              text: param,
            })),
          },
        ];
      }

      const response = await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        data,
      });

      this.logger.log(
        `📧 Template '${nombrePlantilla}' enviado a ${numeroDestino}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error enviando template '${nombrePlantilla}':`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Enviar video tutorial con fallback
   */
  async enviarVideoTutorial(
    numeroUsuario: string,
    videoUrl: string,
    moduloActual: number,
  ): Promise<void> {
    const caption = `🎬 ¡Comencemos con el Módulo ${moduloActual}!\n\nMira este breve video para entender los conceptos clave de este módulo 📹`;

    try {
      // Intentar enviar video
      await this.enviarVideo(numeroUsuario, videoUrl, caption);
      this.logger.log(
        `✅ Video del Módulo ${moduloActual} enviado a ${numeroUsuario}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Error enviando video del Módulo ${moduloActual}, usando fallback de texto`,
      );
      // Fallback: enviar solo el enlace del video
      const textoFallback = `${caption}\n\n🔗 Ver video aquí: ${videoUrl}`;
      await this.enviarMensaje(numeroUsuario, textoFallback);
    }
  }
}
