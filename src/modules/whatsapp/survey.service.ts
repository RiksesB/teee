import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { DatabaseService } from '../database/database.service';
import { PREGUNTAS_ENCUESTA } from '../course/constants/survey.constant';

/**
 * Servicio para manejar la encuesta de satisfacción post-curso
 * Migrado de secure-fortress-06743/index.js
 */
@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly sessionService: SessionService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Iniciar encuesta de satisfacción
   * Actualiza la sesión y envía la primera pregunta
   */
  async iniciarEncuesta(numeroUsuario: string): Promise<void> {
    try {
      this.logger.log(`📋 Iniciando encuesta para usuario: ${numeroUsuario}`);

      // Actualizar sesión con estado de encuesta
      this.sessionService.actualizarSesionUsuario(numeroUsuario, {
        enEncuesta: true,
        enFormulario: false,
        respuestasEncuesta: [],
      });

      // Enviar primera pregunta (índice 0)
      await this.enviarPreguntaEncuesta(numeroUsuario, 0);
    } catch (error) {
      this.logger.error(
        `Error iniciando encuesta para ${numeroUsuario}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Enviar pregunta de encuesta específica
   * @param numeroUsuario - Número de WhatsApp del usuario
   * @param indicePregunta - Índice de la pregunta (0-4)
   */
  async enviarPreguntaEncuesta(
    numeroUsuario: string,
    indicePregunta: number,
  ): Promise<void> {
    try {
      // Validar que el índice esté dentro del rango
      if (indicePregunta >= PREGUNTAS_ENCUESTA.length) {
        this.logger.warn(
          `Índice de pregunta ${indicePregunta} fuera de rango para usuario ${numeroUsuario}`,
        );
        return;
      }

      const pregunta = PREGUNTAS_ENCUESTA[indicePregunta];
      this.logger.log(
        `📤 Enviando pregunta ${indicePregunta + 1}/${PREGUNTAS_ENCUESTA.length} a ${numeroUsuario}`,
      );

      // Construir el mensaje con la pregunta y opciones
      let mensajePregunta = `${pregunta.pregunta}\n\n`;
      pregunta.opciones.forEach((opcion, index) => {
        mensajePregunta += `${opcion}\n`;
      });

      // Si hay 3 o menos opciones, usar botones interactivos
      if (pregunta.ids.length <= 3) {
        // Crear botones dinámicamente basados en los IDs de la pregunta
        const botones = pregunta.ids.map((id, index) => ({
          type: 'reply',
          reply: {
            id: id,
            title: String.fromCharCode(65 + index), // A, B, C
          },
        }));

        await this.whatsappService.enviarBotonesOpciones(
          numeroUsuario,
          mensajePregunta,
          botones,
        );
      } else {
        // Si hay más de 3 opciones, enviar como texto con instrucción
        mensajePregunta +=
          '\n💡 Responde con el número de tu opción (1, 2, 3...)';
        await this.whatsappService.enviarMensaje(
          numeroUsuario,
          mensajePregunta,
        );
      }

      this.logger.log(
        `✅ Pregunta ${indicePregunta + 1} enviada a ${numeroUsuario}`,
      );
    } catch (error) {
      this.logger.error(
        `Error enviando pregunta ${indicePregunta} a ${numeroUsuario}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Procesar respuesta de encuesta
   * @param numeroUsuario - Número de WhatsApp del usuario
   * @param message - Objeto de mensaje de WhatsApp
   * @returns Mensaje de agradecimiento si terminó, null si continúa
   */
  async procesarRespuestaEncuesta(
    numeroUsuario: string,
    message: any,
  ): Promise<string | null> {
    try {
      // Obtener sesión actual
      const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);

      if (!sesion || !sesion.enEncuesta) {
        this.logger.warn(
          `Usuario ${numeroUsuario} no tiene sesión de encuesta activa`,
        );
        return null;
      }

      // Obtener índice de pregunta actual (usar 0 si no existe)
      const indicePreguntaActual = sesion.respuestasEncuesta?.length || 0;
      const preguntaActual = PREGUNTAS_ENCUESTA[indicePreguntaActual];

      if (!preguntaActual) {
        this.logger.warn(
          `No hay pregunta para índice ${indicePreguntaActual} para usuario ${numeroUsuario}`,
        );
        return null;
      }

      // Extraer la respuesta del mensaje
      let respuestaId: string | null = null;

      // Caso 1: Respuesta desde botón interactivo
      if (message.interactive?.button_reply?.id) {
        respuestaId = message.interactive.button_reply.id;
        this.logger.log(
          `📥 Respuesta de botón recibida de ${numeroUsuario}: ${respuestaId}`,
        );
      }
      // Caso 2: Respuesta desde texto (convertir número a ID)
      else if (message.text?.body) {
        const textoRespuesta = message.text.body.trim();
        const numeroRespuesta = parseInt(textoRespuesta, 10);

        // Validar que sea un número válido y esté en el rango
        if (
          !isNaN(numeroRespuesta) &&
          numeroRespuesta >= 1 &&
          numeroRespuesta <= preguntaActual.ids.length
        ) {
          // Convertir número (1-based) a índice (0-based)
          respuestaId = preguntaActual.ids[numeroRespuesta - 1];
          this.logger.log(
            `📥 Respuesta de texto recibida de ${numeroUsuario}: ${textoRespuesta} -> ${respuestaId}`,
          );
        } else {
          // Respuesta inválida
          this.logger.warn(
            `Respuesta inválida de ${numeroUsuario}: "${textoRespuesta}"`,
          );
          await this.whatsappService.enviarMensaje(
            numeroUsuario,
            `⚠️ Respuesta no válida. Por favor, responde con un número del 1 al ${preguntaActual.ids.length} o selecciona un botón.`,
          );
          return null;
        }
      }

      // Si no se pudo extraer respuesta válida
      if (!respuestaId) {
        this.logger.warn(
          `No se pudo extraer respuesta válida del mensaje de ${numeroUsuario}`,
        );
        return null;
      }

      // Guardar respuesta en la sesión
      const respuestasEncuesta = sesion.respuestasEncuesta || [];
      respuestasEncuesta.push({
        pregunta: preguntaActual.numero,
        respuesta: respuestaId,
        timestamp: new Date(),
      });

      // Actualizar sesión con la respuesta
      this.sessionService.actualizarSesionUsuario(numeroUsuario, {
        respuestasEncuesta,
      });

      this.logger.log(
        `✅ Respuesta guardada: Usuario ${numeroUsuario}, Pregunta ${preguntaActual.numero}, Respuesta: ${respuestaId}`,
      );

      // Verificar si hay más preguntas
      const siguienteIndice = indicePreguntaActual + 1;

      if (siguienteIndice < PREGUNTAS_ENCUESTA.length) {
        // Hay más preguntas, enviar la siguiente después de un delay
        this.logger.log(
          `➡️ Enviando siguiente pregunta (${siguienteIndice + 1}/${PREGUNTAS_ENCUESTA.length}) a ${numeroUsuario}`,
        );

        setTimeout(async () => {
          try {
            await this.enviarPreguntaEncuesta(numeroUsuario, siguienteIndice);
          } catch (error) {
            this.logger.error(
              `Error enviando siguiente pregunta a ${numeroUsuario}:`,
              error,
            );
          }
        }, 1500); // Delay de 1.5 segundos

        return null; // Continuar con encuesta
      } else {
        // Encuesta completada
        this.logger.log(
          `🎉 Encuesta completada para usuario ${numeroUsuario}`,
        );

        // Guardar resultados en la base de datos
        try {
          await this.databaseService.guardarRespuestasEncuesta(
            numeroUsuario,
            respuestasEncuesta,
            sesion.resultadosModulos || [],
          );
          this.logger.log(
            `💾 Respuestas de encuesta guardadas en DB para ${numeroUsuario}`,
          );
        } catch (dbError) {
          this.logger.error(
            `Error guardando encuesta en DB para ${numeroUsuario}:`,
            dbError,
          );
          // Continuar aunque falle el guardado en DB
        }

        // Eliminar sesión del usuario
        this.sessionService.eliminarSesion(numeroUsuario);
        this.logger.log(
          `🗑️ Sesión eliminada para usuario ${numeroUsuario} tras completar encuesta`,
        );

        // Retornar mensaje de agradecimiento
        return (
          '🎉 **¡Gracias por completar la encuesta!**\n\n' +
          'Tu feedback es muy valioso para mejorar nuestros cursos.\n\n' +
          '✅ **Has completado exitosamente:**\n' +
          '• 6 módulos de seguridad digital\n' +
          '• Certificado de finalización\n' +
          '• Encuesta de satisfacción\n\n' +
          '¡Esperamos que hayas disfrutado el curso! 🚀'
        );
      }
    } catch (error) {
      this.logger.error(
        `Error procesando respuesta de encuesta para ${numeroUsuario}:`,
        error,
      );
      throw error;
    }
  }
}
