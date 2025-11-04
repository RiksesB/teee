import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { CourseService } from './course.service';
import { SurveyService } from './survey.service';

/**
 * MessageRouterService
 *
 * Servicio responsable de enrutar y procesar mensajes entrantes de WhatsApp.
 * Implementa la lógica completa de procesamiento de mensajes del sistema original,
 * decidiendo qué acción tomar basándose en el tipo de mensaje, estado de sesión,
 * y comandos del usuario.
 */
@Injectable()
export class MessageRouterService {
  private readonly logger = new Logger(MessageRouterService.name);
  private readonly showPruebaTips: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappService: WhatsAppService,
    private readonly sessionService: SessionService,
    private readonly courseService: CourseService,
    private readonly surveyService: SurveyService,
  ) {
    this.showPruebaTips = this.configService.get<string>('MOSTRAR_TIP_PRUEBA') !== 'false';
    this.logger.log('MessageRouterService initialized');
    this.logger.log(`Show prueba tips: ${this.showPruebaTips}`);
  }

  /**
   * Método principal para procesar mensajes de usuarios
   *
   * Este método implementa la lógica completa de enrutamiento de mensajes:
   * 1. Extrae el contenido del mensaje según su tipo (text, button, interactive)
   * 2. Identifica si es una respuesta de formulario o encuesta
   * 3. Enruta el mensaje a la acción apropiada según el contexto
   * 4. Envía la respuesta al usuario si es necesario
   *
   * @param numeroUsuario - Número de teléfono del usuario (formato internacional)
   * @param message - Objeto de mensaje de WhatsApp con type y contenido
   */
  async procesarMensajeUsuario(numeroUsuario: string, message: any): Promise<void> {
    let textoMensaje = "";
    let esRespuestaFormulario = false;
    let esRespuestaEncuesta = false;

    // ============================================================
    // FASE 1: EXTRACCIÓN DEL CONTENIDO DEL MENSAJE
    // ============================================================

    // Extraer el texto del mensaje según su tipo
    if (message.type === "text") {
      // Mensaje de texto plano
      textoMensaje = message.text.body.toLowerCase().trim();
      this.logger.debug(`Mensaje de texto recibido: "${textoMensaje}"`);
    }
    else if (message.type === "button") {
      // Manejar botón de plantilla (Campaign template button)
      if (
        message.button?.payload === "prueba" ||
        message.button?.text === "prueba"
      ) {
        textoMensaje = "prueba"; // Tratar como comando prueba
        this.logger.log("Botón de plantilla detectado: iniciando prueba");
      } else if (
        message.button?.payload === "eINSERTAREMOJI" ||
        message.button?.text === "eINSERTAREMOJI"
      ) {
        textoMensaje = "eINSERTAREMOJI"; // Tratar como comando especial
        this.logger.log("Botón eINSERTAREMOJI detectado: enviando imagen especial");
      }
    }
    else if (message.type === "interactive") {
      // Manejar botones interactivos
      if (message.interactive.type === "button_reply") {
        const buttonId = message.interactive.button_reply.id;
        this.logger.debug(`Botón interactivo presionado: ${buttonId}`);

        // Verificar si es el botón de iniciar
        if (buttonId === "iniciar_si") {
          textoMensaje = "comenzar";
        } else if (buttonId === "iniciar_no") {
          textoMensaje = "no_iniciar";
        }
        // Verificar si es una respuesta A, B, C, D del formulario
        else if (buttonId.startsWith("respuesta_")) {
          esRespuestaFormulario = true;
          this.logger.debug("Detectada respuesta de formulario");
        }
        // Verificar si es una respuesta de encuesta
        else if (
          buttonId.includes("duracion_") ||
          buttonId.includes("comprension_") ||
          buttonId.includes("dinamica_") ||
          buttonId.includes("utilidad_") ||
          buttonId.includes("recomendacion_")
        ) {
          esRespuestaEncuesta = true;
          this.logger.debug("Detectada respuesta de encuesta");
        }
      }
      // Manejar respuestas de lista (para preguntas con 4+ opciones)
      else if (message.interactive.type === "list_reply") {
        const listId = message.interactive.list_reply.id;
        this.logger.debug(`Respuesta de lista recibida: ${listId}`);
        if (listId.startsWith("respuesta_")) {
          esRespuestaFormulario = true;
          this.logger.debug("Detectada respuesta de formulario desde lista");
        }
      }
    }

    // ============================================================
    // FASE 2: ENRUTAMIENTO Y PROCESAMIENTO
    // ============================================================

    let respuesta: string | null = null;
    const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);

    try {
      // A. Respuesta de Formulario Activo (prioridad alta)
      if (esRespuestaFormulario && sesion?.enFormulario) {
        this.logger.log(`Procesando respuesta de formulario para usuario ${numeroUsuario}`);
        respuesta = await this.courseService.procesarRespuestaFormulario(numeroUsuario, message);
      }

      // B. Respuesta de Encuesta Activa (prioridad alta)
      else if (esRespuestaEncuesta && sesion?.enEncuesta) {
        this.logger.log(`Procesando respuesta de encuesta para usuario ${numeroUsuario}`);
        respuesta = await this.surveyService.procesarRespuestaEncuesta(numeroUsuario, message);
      }

      // C. Comando "salir" - Abandonar prueba actual
      else if (textoMensaje === "salir") {
        this.logger.log(`Usuario ${numeroUsuario} ejecutó comando salir`);
        this.logger.debug("=== DEBUG comando salir ===");
        this.logger.debug(`Sesión: ${JSON.stringify(sesion)}`);

        if (
          sesion &&
          (sesion.enFormulario ||
            sesion.estado === "viendo_video" ||
            sesion.enEncuesta)
        ) {
          // Generar resumen parcial del progreso
          respuesta = this.courseService.generarResumenParcial(
            sesion.resultadosModulos || [],
            sesion.modulo || 1,
            sesion.respuestasCorrectas || 0,
            sesion.preguntaActual || 0,
            sesion
          );
          this.sessionService.eliminarSesion(numeroUsuario); // Limpiar sesión
          this.logger.log(`Sesión eliminada para usuario ${numeroUsuario}`);
        } else {
          respuesta = this.showPruebaTips
            ? "No hay ninguna prueba activa. Escribe 'prueba' para comenzar."
            : "No hay ninguna prueba activa.";
        }
      }

      // D. Comando especial "eINSERTAREMOJI" - Easter egg
      else if (textoMensaje === "eINSERTAREMOJI") {
        this.logger.log(`Usuario ${numeroUsuario} ejecutó comando especial eINSERTAREMOJI`);
        try {
          await this.whatsappService.enviarImagen(
            numeroUsuario,
            "https://i.chzbgr.com/full/6796713984/hF30B7124/furry-query",
            "😂 eINSERTAREMOJI"
          );
          respuesta = null; // No enviar mensaje adicional
          this.logger.log("Imagen especial enviada exitosamente");
        } catch (error) {
          this.logger.error(`Error enviando imagen especial: ${error.message}`, error.stack);
          respuesta = "No pude enviar la imagen xd";
        }
      }

      // E. Comando "prueba" - Iniciar curso
      else if (textoMensaje === "prueba") {
        this.logger.log(`Usuario ${numeroUsuario} ejecutó comando prueba`);
        // Intentar enviar mensaje directo primero (sin plantilla)
        // Si falla por error 131047 (24h window), iniciarPruebaDirecta automáticamente reintentará con plantilla
        await this.courseService.iniciarPruebaDirecta(numeroUsuario, false);
        respuesta = null; // No enviar mensaje adicional (iniciarPruebaDirecta maneja el envío)
      }

      // F. Comando "comenzar" - Iniciar o continuar
      else if (textoMensaje === "comenzar") {
        this.logger.log(`Usuario ${numeroUsuario} ejecutó comando comenzar`);

        // Si no hay sesión activa, iniciar la prueba directamente
        if (!sesion) {
          this.logger.debug("No hay sesión, iniciando prueba directamente");
          await this.courseService.iniciarPruebaDirecta(numeroUsuario);
          respuesta = null;
        } else if (
          sesion.estado === "viendo_video" ||
          sesion.estado === "en_prueba"
        ) {
          // Si ya está en proceso, continuar con el formulario
          this.logger.debug(`Sesión en estado ${sesion.estado}, iniciando formulario`);
          await this.courseService.iniciarFormulario(numeroUsuario);
          respuesta = null; // iniciarFormulario maneja el envío
        } else {
          respuesta =
            "Ya tienes una prueba en progreso. Continúa respondiendo las preguntas.";
        }
      }

      // G. Comando "no_iniciar" - Rechazar inicio
      else if (textoMensaje === "no_iniciar") {
        this.logger.log(`Usuario ${numeroUsuario} rechazó iniciar la prueba`);
        this.sessionService.eliminarSesion(numeroUsuario); // Limpiar sesión
        respuesta = this.showPruebaTips
          ? "Está bien, puedes iniciar la prueba cuando quieras. Escribe 'prueba' para comenzar de nuevo."
          : "Está bien, puedes iniciar la prueba cuando quieras.";
      }

      // H. Usuario con Formulario Activo (sin ser respuesta directa)
      else if (sesion?.enFormulario) {
        this.logger.log(`Usuario ${numeroUsuario} tiene formulario activo, procesando mensaje como respuesta`);
        respuesta = await this.courseService.procesarRespuestaFormulario(numeroUsuario, message);
      }

      // I. Usuario con Encuesta Activa (sin ser respuesta directa)
      else if (sesion?.enEncuesta) {
        this.logger.log(`Usuario ${numeroUsuario} tiene encuesta activa, procesando mensaje como respuesta`);
        respuesta = await this.surveyService.procesarRespuestaEncuesta(numeroUsuario, message);
      }

      // J. Echo (Default) - Repetir mensaje y mostrar tips
      else if (!esRespuestaFormulario && !esRespuestaEncuesta) {
        this.logger.debug(`Respuesta echo para usuario ${numeroUsuario}`);
        const echoText =
          "Echo: " +
          (message.type === "text" ? message.text.body : "Mensaje interactivo");

        const tipText = this.showPruebaTips
          ? "\n\n💡 Tip: Escribe 'prueba' para iniciar el curso de seguridad digital.\n📤 Escribe 'salir' en cualquier momento para abandonar la prueba."
          : "\n\n📤 Escribe 'salir' en cualquier momento para abandonar la prueba.";

        respuesta = echoText + tipText;
      }

      // ============================================================
      // FASE 3: ENVÍO DE RESPUESTA
      // ============================================================

      // Enviar respuesta solo si hay una
      // (algunas rutas manejan el envío internamente y retornan null)
      if (respuesta) {
        this.logger.debug(`Enviando respuesta a ${numeroUsuario}: ${respuesta.substring(0, 100)}...`);
        await this.whatsappService.enviarMensaje(numeroUsuario, respuesta);
      } else {
        this.logger.debug(`No se envía respuesta (manejada internamente)`);
      }

    } catch (error) {
      this.logger.error(
        `Error procesando mensaje de usuario ${numeroUsuario}: ${error.message}`,
        error.stack
      );

      // Enviar mensaje de error al usuario
      try {
        await this.whatsappService.enviarMensaje(
          numeroUsuario,
          "❌ Ocurrió un error procesando tu mensaje. Por favor intenta de nuevo."
        );
      } catch (sendError) {
        this.logger.error(
          `Error enviando mensaje de error: ${sendError.message}`,
          sendError.stack
        );
      }
    }
  }
}
