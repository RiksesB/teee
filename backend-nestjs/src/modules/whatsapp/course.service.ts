import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { DatabaseService } from '../database/database.service';
import { SurveyService } from './survey.service';
import { ConfigService } from '@nestjs/config';
import { MODULOS, VIDEOS_MODULOS } from '../course/constants/modules.constant';
import axios from 'axios';

/**
 * Interfaces para el flujo del curso
 */
interface RandomizacionResult {
  opcionesRandomizadas: string[];
  mapeoRespuestas: Record<string, string>;
  mapeoRetroalimentacion: Record<string, string>;
  respuestaCorrectaNueva: string;
}

interface PreguntaCustom {
  numero: number;
  pregunta: string;
  opciones: string[];
}

/**
 * Servicio para manejar la lógica completa del curso educativo
 * Incluye randomización de preguntas, flujo de módulos, y generación de certificados
 */
@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly sessionService: SessionService,
    private readonly databaseService: DatabaseService,
    private readonly surveyService: SurveyService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Randomiza las opciones de una pregunta para prevenir copia
   * @param pregunta - Pregunta original con sus opciones
   * @param quitarUnaIncorrecta - Si es true y hay 4 opciones, 50% chance de quitar una incorrecta
   * @returns Objeto con opciones randomizadas y mapeos
   */
  randomizarOpciones(pregunta: any, quitarUnaIncorrecta: boolean = false): RandomizacionResult {
    // Crear array con índices de las opciones originales
    let indicesOriginales = pregunta.opciones.map((_, i) => i);

    // Si es pregunta de 4 opciones, a veces quitar una incorrecta (50% probabilidad)
    if (pregunta.opciones.length === 4 && quitarUnaIncorrecta && Math.random() > 0.5) {
      // Identificar índice de respuesta correcta (A=0, B=1, C=2, D=3)
      const indiceCorrectoOriginal = pregunta.respuesta_correcta.charCodeAt(0) - 65;

      // Obtener índices de opciones incorrectas
      const indicesIncorrectos = indicesOriginales.filter(i => i !== indiceCorrectoOriginal);

      // Quitar una opción incorrecta al azar
      const indiceAQuitar = indicesIncorrectos[Math.floor(Math.random() * indicesIncorrectos.length)];
      indicesOriginales.splice(indicesOriginales.indexOf(indiceAQuitar), 1);

      this.logger.debug(`🎲 Pregunta de 4 opciones: Quitada opción ${String.fromCharCode(65 + indiceAQuitar)} incorrecta`);
    }

    // Mezclar índices usando Fisher-Yates shuffle
    for (let i = indicesOriginales.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indicesOriginales[i], indicesOriginales[j]] = [indicesOriginales[j], indicesOriginales[i]];
    }

    // Crear opciones mezcladas y mapeo de letras
    const opcionesRandomizadas: string[] = [];
    const mapeoRespuestas: Record<string, string> = {}; // letra mostrada → letra original
    const mapeoRetroalimentacion: Record<string, string> = {}; // letra mostrada → retroalimentación

    indicesOriginales.forEach((indiceOriginal, nuevoIndice) => {
      const letraOriginal = String.fromCharCode(65 + indiceOriginal); // A, B, C, D
      const letraNueva = String.fromCharCode(65 + nuevoIndice); // A, B, C

      // Obtener texto de la opción (sin la letra del principio)
      const textoOpcion = pregunta.opciones[indiceOriginal];

      // Agregar con nueva letra
      const nuevaLetra = String.fromCharCode(97 + nuevoIndice); // a, b, c
      opcionesRandomizadas.push(`${nuevaLetra}) ${textoOpcion.substring(3)}`);

      // Guardar mapeo
      mapeoRespuestas[letraNueva] = letraOriginal;
      mapeoRetroalimentacion[letraNueva] = pregunta.retroalimentacion[letraOriginal];
    });

    // Determinar nueva letra correcta
    const letraCorrectaOriginal = pregunta.respuesta_correcta;
    const letraCorrectaNueva = Object.keys(mapeoRespuestas).find(
      key => mapeoRespuestas[key] === letraCorrectaOriginal
    );

    return {
      opcionesRandomizadas,
      mapeoRespuestas,
      mapeoRetroalimentacion,
      respuestaCorrectaNueva: letraCorrectaNueva || 'A',
    };
  }

  /**
   * Envía una pregunta con opciones randomizadas
   * Decide automáticamente entre botones (≤3 opciones) o lista (>3 opciones)
   */
  async enviarPregunta(numeroUsuario: string, indicePregunta: number): Promise<void> {
    const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);
    if (!sesion || !sesion.modulo) {
      this.logger.error(`No hay sesión activa para usuario ${numeroUsuario}`);
      return;
    }

    const moduloUsuario = sesion.modulo;
    const preguntaOriginal = MODULOS[moduloUsuario].preguntas[indicePregunta];

    // Randomizar opciones para este usuario
    const randomizado = this.randomizarOpciones(preguntaOriginal, true);

    // Guardar mapeo en la sesión para procesar la respuesta después
    if (!sesion.mapeosPreguntas) {
      sesion.mapeosPreguntas = {};
    }
    sesion.mapeosPreguntas[indicePregunta] = {
      mapeoRespuestas: randomizado.mapeoRespuestas,
      mapeoRetroalimentacion: randomizado.mapeoRetroalimentacion,
      respuestaCorrectaNueva: randomizado.respuestaCorrectaNueva,
    };

    // Crear pregunta temporal con opciones randomizadas
    const preguntaParaMostrar: PreguntaCustom = {
      numero: preguntaOriginal.numero,
      pregunta: preguntaOriginal.pregunta,
      opciones: randomizado.opcionesRandomizadas,
    };

    const numOpciones = preguntaParaMostrar.opciones.length;

    this.logger.debug(`🎲 Opciones randomizadas para ${numeroUsuario}: ${numOpciones} opciones, correcta: ${randomizado.respuestaCorrectaNueva}`);

    // Si hay más de 3 opciones, usar lista. Sino, usar botones
    if (numOpciones > 3) {
      this.logger.log(`📝 Enviando pregunta con lista (${numOpciones} opciones) para ${numeroUsuario}`);
      await this.enviarPreguntaConListaCustom(numeroUsuario, indicePregunta, preguntaParaMostrar);
    } else {
      this.logger.log(`📝 Enviando pregunta con botones (${numOpciones} opciones) para ${numeroUsuario}`);
      await this.enviarPreguntaConBotonesCustom(numeroUsuario, indicePregunta, preguntaParaMostrar);
    }
  }

  /**
   * Envía pregunta usando botones interactivos (para 3 o menos opciones)
   */
  async enviarPreguntaConBotonesCustom(
    numeroUsuario: string,
    indicePregunta: number,
    preguntaCustom: PreguntaCustom,
  ): Promise<void> {
    try {
      // Crear mensaje completo con opciones customizadas
      let mensaje = `🟡 Pregunta ${preguntaCustom.numero}:\n${preguntaCustom.pregunta}\n\n`;

      // Agregar todas las opciones completas en el texto
      preguntaCustom.opciones.forEach((opcion) => {
        mensaje += `${opcion}\n`;
      });

      mensaje += `\n💡 Selecciona tu respuesta:`;

      // Crear botones dinámicamente basados en número de opciones
      const botones = preguntaCustom.opciones.map((_, index) => {
        const letra = String.fromCharCode(97 + index); // a, b, c
        return {
          type: 'reply',
          reply: {
            id: `respuesta_${letra}_${indicePregunta}`,
            title: letra.toUpperCase(),
          },
        };
      });

      await this.whatsappService.enviarBotonesOpciones(numeroUsuario, mensaje, botones);
    } catch (error) {
      this.logger.error(`Error enviando pregunta con botones: ${error}`);
      // Fallback a texto si falla
      try {
        let mensajeFallback = `🔴 Pregunta ${preguntaCustom.numero}:\n${preguntaCustom.pregunta}\n\n`;
        preguntaCustom.opciones.forEach((opcion) => {
          mensajeFallback += `${opcion}\n`;
        });
        mensajeFallback += `\n💡 Responde con: A, B o C`;
        await this.whatsappService.enviarMensaje(numeroUsuario, mensajeFallback);
      } catch (fallbackError) {
        this.logger.error('Error en fallback:', fallbackError);
      }
    }
  }

  /**
   * Envía pregunta usando lista interactiva (para 4 o más opciones)
   */
  async enviarPreguntaConListaCustom(
    numeroUsuario: string,
    indicePregunta: number,
    preguntaCustom: PreguntaCustom,
  ): Promise<void> {
    try {
      // Crear filas para la lista con opciones customizadas
      const rows = preguntaCustom.opciones.map((opcion, index) => {
        const letra = String.fromCharCode(65 + index); // A, B, C, D...
        return {
          id: `respuesta_${letra.toLowerCase()}_${indicePregunta}`,
          title: letra,
          description: opcion.length > 72 ? opcion.substring(0, 69) + '...' : opcion,
        };
      });

      const apiVersion = this.configService.get<string>('WHATSAPP_API_VERSION');
      const businessPhone = this.configService.get<string>('WHATSAPP_BUSINESS_PHONE');
      const apiToken = this.configService.get<string>('WHATSAPP_API_TOKEN');

      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/${apiVersion}/${businessPhone}/messages`,
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        data: {
          messaging_product: 'whatsapp',
          to: numeroUsuario,
          type: 'interactive',
          interactive: {
            type: 'list',
            header: {
              type: 'text',
              text: `Pregunta ${preguntaCustom.numero}`,
            },
            body: {
              text: preguntaCustom.pregunta,
            },
            footer: {
              text: '💡 Selecciona tu respuesta',
            },
            action: {
              button: 'Ver opciones',
              sections: [{
                title: 'Respuestas',
                rows: rows,
              }],
            },
          },
        },
      });

      this.logger.log(`✅ Lista enviada con ${rows.length} opciones para usuario ${numeroUsuario}`);
    } catch (error: any) {
      this.logger.error(`Error enviando lista:`, error.response?.data || error.message);
      // Fallback a texto si falla
      try {
        let mensajeFallback = `🟡 Pregunta ${preguntaCustom.numero}:\n${preguntaCustom.pregunta}\n\n`;
        preguntaCustom.opciones.forEach((opcion) => {
          mensajeFallback += `${opcion}\n`;
        });
        mensajeFallback += `\n💡 Responde con la letra (A, B, C, D, etc.)`;
        await this.whatsappService.enviarMensaje(numeroUsuario, mensajeFallback);
      } catch (fallbackError) {
        this.logger.error('Error en fallback:', fallbackError);
      }
    }
  }

  /**
   * Inicia la prueba directamente para un usuario
   * Limpia sesiones anteriores y comienza desde el módulo 1
   */
  async iniciarPruebaDirecta(numeroUsuario: string, usarPlantilla: boolean = false): Promise<void> {
    // Validar número de teléfono
    if (!numeroUsuario || typeof numeroUsuario !== 'string' || numeroUsuario.trim() === '') {
      throw new Error(`Número de teléfono inválido: ${numeroUsuario}`);
    }

    // Limpiar cualquier sesión anterior
    if (this.sessionService.obtenerSesionUsuario(numeroUsuario)) {
      const sesionAnterior = this.sessionService.obtenerSesionUsuario(numeroUsuario);
      this.logger.log(`🧹 Limpiando sesión anterior para ${numeroUsuario} (estaba en módulo ${sesionAnterior?.modulo || 'desconocido'})`);
      this.sessionService.eliminarSesion(numeroUsuario);
    }

    // Configurar sesión inicial - cada usuario empieza desde el módulo 1
    const sessionData = {
      estado: 'en_prueba',
      iniciadoEn: new Date(),
      ultimaActividad: new Date(),
      modulo: 1, // Cada usuario empieza desde el módulo 1
      resultadosModulos: [],
      numeroUsuario: numeroUsuario,
      respuestasDetalladas: [], // Inicializar array de respuestas
    };

    // Usar crearSesion y luego actualizar con datos adicionales
    this.sessionService.crearSesion(numeroUsuario, 1);
    this.sessionService.actualizarSesionUsuario(numeroUsuario, sessionData);
    this.logger.log(`🆕 Nueva sesión creada para ${numeroUsuario}: Módulo 1`);

    // Guardar datos de inicio de sesión
    await this.databaseService.guardarDatosUsuario({
      ...sessionData,
      evento: 'inicio_curso',
      usarPlantilla,
    });

    try {
      this.logger.log(`🔍 DEBUG: usarPlantilla = ${usarPlantilla} para ${numeroUsuario}`);

      // NO enviar plantilla - enviar directo como secure-fortress original
      // El código solo llegará aquí si usarPlantilla es false (por defecto)
      // Si aparece Error 131047, el catch block reintentará con plantilla

      // Enviar el video del primer módulo (sin bloquear)
      this.logger.log(`🎬 Intentando enviar video tutorial para ${numeroUsuario}, módulo ${sessionData.modulo}`);
      try {
        await this.enviarVideoTutorial(numeroUsuario, sessionData.modulo);
        this.logger.log(`✅ Video tutorial enviado exitosamente para ${numeroUsuario}`);
      } catch (videoError) {
        this.logger.error(`❌ Error enviando video tutorial: ${videoError}`);
        this.logger.error(`Stack trace:`, videoError.stack);
        // Continuar sin video si falla
      }

      // Esperar un poco antes de iniciar el formulario
      this.logger.log(`⏰ Programando inicio de formulario en 2 segundos para ${numeroUsuario}`);
      setTimeout(async () => {
        this.logger.log(`🔄 Ejecutando setTimeout: iniciando formulario para ${numeroUsuario}`);
        try {
          await this.iniciarFormulario(numeroUsuario);
          this.logger.log(`✅ Formulario iniciado exitosamente para ${numeroUsuario}`);
        } catch (formError) {
          this.logger.error(`❌ Error iniciando formulario: ${formError}`);
          this.logger.error(`Stack trace:`, formError.stack);
          // Intentar notificar al usuario
          try {
            const showPruebaTips = this.configService.get<boolean>('MOSTRAR_TIP_PRUEBA', true);
            const tip = showPruebaTips
              ? " Escribe 'prueba' para reintentar."
              : ' Inténtalo de nuevo más tarde.';
            await this.whatsappService.enviarMensaje(numeroUsuario, `⚠️ Hubo un problema.${tip}`);
          } catch (e) {
            this.logger.error('No se pudo notificar al usuario:', e);
          }
        }
      }, 2000);

      this.logger.log(`✅ iniciarPruebaDirecta completado para ${numeroUsuario} (setTimeout programado)`);
    } catch (error: any) {
      this.logger.error(`Error iniciando prueba para ${numeroUsuario}:`, error);

      // Si falló y no estábamos usando plantilla, intentar con plantilla
      const errorCode = error.response?.data?.error?.code ||
        error.response?.data?.error?.error_data?.code ||
        (error.response?.data?.error &&
          error.response.data.error.find &&
          error.response.data.error.find((e: any) => e.code === 131047)?.code);

      if (!usarPlantilla && (errorCode === 131047 || error.message?.includes('131047'))) {
        this.logger.log('🔄 Error 131047 detectado - Reintentando con plantilla...');
        this.logger.log('Error original:', JSON.stringify(error.response?.data, null, 2));
        return this.iniciarPruebaDirecta(numeroUsuario, true);
      }

      throw error;
    }
  }

  /**
   * Envía video tutorial con sistema de fallback - NO BLOQUEA EL PROGRESO
   */
  private async enviarVideoTutorial(numeroUsuario: string, moduloActual: number): Promise<void> {
    const caption =
      `🎬 Video Tutorial - Módulo ${moduloActual}\n\n` +
      `📹 Te recomendamos ver este video para aprender sobre el tema.\n\n` +
      `💡 Puedes continuar con las preguntas cuando quieras.`;

    try {
      // Intentar enviar el video
      await this.whatsappService.enviarVideo(numeroUsuario, VIDEOS_MODULOS[moduloActual], caption);
      this.logger.log(`Video del módulo ${moduloActual} enviado exitosamente`);
    } catch (error) {
      this.logger.error('Error enviando video, usando fallback:', error);
      // Fallback: enviar mensaje de texto con enlace
      const mensajeFallback =
        `🎬 Video Tutorial - Módulo ${moduloActual}\n\n` +
        `📹 Puedes ver el video en: ${VIDEOS_MODULOS[moduloActual]}\n\n` +
        `💡 Te recomendamos verlo para aprender sobre el tema.`;
      await this.whatsappService.enviarMensaje(numeroUsuario, mensajeFallback);
    }
  }

  /**
   * Inicia el formulario/quiz del módulo actual
   */
  async iniciarFormulario(numeroUsuario: string): Promise<void> {
    try {
      this.logger.log(`📝 Iniciando formulario para usuario ${numeroUsuario}`);

      // Obtener la sesión actual del usuario
      const sesionAnterior = this.sessionService.obtenerSesionUsuario(numeroUsuario);
      const moduloUsuario = sesionAnterior?.modulo || 1;

      // Validar que el módulo actual existe
      if (!MODULOS[moduloUsuario]) {
        this.logger.error(`Módulo ${moduloUsuario} no existe para usuario ${numeroUsuario}`);
        return;
      }

      const nuevaSesion = this.sessionService.actualizarSesionUsuario(numeroUsuario, {
        enFormulario: true,
        preguntaActual: 0,
        respuestasCorrectas: 0,
        iniciadoEn: new Date(),
        modulo: moduloUsuario,
        resultadosModulos: sesionAnterior?.resultadosModulos || [],
        estado: 'en_formulario',
      });

      // Enviar título del módulo primero
      this.logger.log(`📋 Enviando título del módulo ${moduloUsuario} a ${numeroUsuario}`);
      await this.whatsappService.enviarMensaje(numeroUsuario, MODULOS[moduloUsuario].titulo);

      // Pequeña pausa antes de enviar la primera pregunta
      setTimeout(async () => {
        try {
          await this.enviarPregunta(numeroUsuario, 0);
        } catch (error) {
          this.logger.error(`Error enviando primera pregunta a ${numeroUsuario}:`, error);
        }
      }, 1500);
    } catch (error) {
      this.logger.error(`Error iniciando formulario para ${numeroUsuario}:`, error);
      throw error;
    }
  }

  /**
   * Procesa la respuesta del usuario a una pregunta del quiz
   * Maneja botones, listas y texto, valida respuestas, y avanza al siguiente módulo
   */
  async procesarRespuestaFormulario(numeroUsuario: string, message: any): Promise<string | null> {
    const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);
    const showPruebaTips = this.configService.get<boolean>('MOSTRAR_TIP_PRUEBA', true);

    if (!sesion || !sesion.enFormulario) {
      return showPruebaTips
        ? "No tienes un formulario activo. Escribe 'prueba' para comenzar."
        : 'No tienes un formulario activo.';
    }

    let respuestaSeleccionada: string | undefined;

    // Verificar si es una respuesta de botón interactivo o lista
    if (message.type === 'interactive') {
      // Respuesta de botón (para preguntas con 3 opciones)
      if (message.interactive.type === 'button_reply') {
        const buttonId = message.interactive.button_reply.id;

        // Extraer la letra de la respuesta (a, b, c, d...) del nuevo formato
        if (buttonId.startsWith('respuesta_')) {
          const letra = buttonId.split('_')[1]; // Extraer a, b, c, d...
          respuestaSeleccionada = letra.toUpperCase(); // Convertir a mayúscula
        }
      }
      // Respuesta de lista (para preguntas con 4+ opciones)
      else if (message.interactive.type === 'list_reply') {
        const listId = message.interactive.list_reply.id;

        // Extraer la letra de la respuesta del id de la lista
        if (listId.startsWith('respuesta_')) {
          const letra = listId.split('_')[1]; // Extraer a, b, c, d...
          respuestaSeleccionada = letra.toUpperCase(); // Convertir a mayúscula
          this.logger.log(`📋 Respuesta de lista recibida: ${respuestaSeleccionada}`);
        }
      }
    } else if (message.type === 'text') {
      // Respuesta de texto como fallback (soporta A-Z)
      const textoRespuesta = message.text.body.trim().toLowerCase();

      // Verificar si es una letra válida (a-z)
      if (/^[a-z]$/.test(textoRespuesta)) {
        respuestaSeleccionada = textoRespuesta.toUpperCase();
      } else {
        await this.whatsappService.enviarMensaje(
          numeroUsuario,
          'Por favor, responde con los botones/lista o escribe una letra (A, B, C, D, etc.)',
        );
        return null;
      }
    }

    // Verificar que tenemos una respuesta válida
    if (!respuestaSeleccionada) {
      await this.whatsappService.enviarMensaje(numeroUsuario, 'Por favor, selecciona una opción.');
      return null;
    }

    const moduloUsuario = sesion.modulo;
    const preguntaActualIndex = sesion.preguntaActual ?? 0;
    const preguntaOriginal = MODULOS[moduloUsuario].preguntas[preguntaActualIndex];

    // Obtener mapeo de opciones randomizadas para esta pregunta
    const mapeo = sesion.mapeosPreguntas?.[preguntaActualIndex];

    let respuestaCorrecta: boolean;
    let retroalimentacion: string;
    let respuestaOriginal: string;

    if (mapeo) {
      // Usar mapeo para determinar respuesta correcta y retroalimentación
      respuestaOriginal = mapeo.mapeoRespuestas[respuestaSeleccionada];
      respuestaCorrecta = respuestaSeleccionada === mapeo.respuestaCorrectaNueva;
      retroalimentacion = mapeo.mapeoRetroalimentacion[respuestaSeleccionada];

      this.logger.log(`🎲 Mapeo usado: ${respuestaSeleccionada} → ${respuestaOriginal} original`);
    } else {
      // Fallback: sin randomización (backward compatibility)
      respuestaOriginal = respuestaSeleccionada;
      respuestaCorrecta = respuestaSeleccionada === preguntaOriginal.respuesta_correcta;
      retroalimentacion = preguntaOriginal.retroalimentacion[respuestaSeleccionada];

      this.logger.warn(`⚠️ Sin mapeo, usando respuesta directa`);
    }

    if (respuestaCorrecta) {
      sesion.respuestasCorrectas = (sesion.respuestasCorrectas || 0) + 1;
    }

    // Guardar respuesta detallada para analytics
    if (!sesion.respuestasDetalladas) {
      sesion.respuestasDetalladas = [];
    }

    // Log de la respuesta para debugging
    this.logger.log(
      `📝 Usuario ${numeroUsuario} - Módulo ${moduloUsuario}, Pregunta ${preguntaActualIndex + 1}: Respuesta ${respuestaSeleccionada} (${respuestaCorrecta ? '✅ Correcta' : '❌ Incorrecta'})`,
    );

    sesion.respuestasDetalladas.push({
      pregunta: preguntaActualIndex + 1,
      preguntaTexto: preguntaOriginal.pregunta,
      respuestaSeleccionada,
      respuestaOriginal, // Guardar también la respuesta original para analytics
      respuestaCorrecta: preguntaOriginal.respuesta_correcta,
      esCorrecta: respuestaCorrecta,
      timestamp: new Date(),
    });

    // Enviar retroalimentación específica
    if (retroalimentacion) {
      await this.whatsappService.enviarMensaje(numeroUsuario, retroalimentacion);
    }

    sesion.preguntaActual = preguntaActualIndex + 1;
    sesion.ultimaActividad = new Date(); // Actualizar actividad

    // Verificar si hay más preguntas
    if (sesion.preguntaActual < MODULOS[moduloUsuario].preguntas.length) {
      // Pequeña pausa antes de enviar siguiente pregunta
      setTimeout(async () => {
        try {
          await this.enviarPregunta(numeroUsuario, sesion.preguntaActual!);
        } catch (error) {
          this.logger.error(`Error enviando pregunta ${sesion.preguntaActual}:`, error);
        }
      }, 2000);
      return null;
    } else {
      // Módulo completado - guardar resultado
      const resultadoModulo = {
        modulo: moduloUsuario,
        titulo: MODULOS[moduloUsuario].titulo,
        respuestasCorrectas: sesion.respuestasCorrectas || 0,
        totalPreguntas: MODULOS[moduloUsuario].preguntas.length,
        porcentaje: ((sesion.respuestasCorrectas || 0) / MODULOS[moduloUsuario].preguntas.length) * 100,
      };

      sesion.resultadosModulos = sesion.resultadosModulos || [];
      sesion.resultadosModulos.push(resultadoModulo);

      // Guardar datos del módulo completado
      await this.databaseService.guardarRespuestasFormulario(numeroUsuario, moduloUsuario, {
        resultadoModulo,
        respuestasDetalladas: sesion.respuestasDetalladas || [],
        fecha_completado: new Date(),
      });

      // Mostrar resultado del módulo actual
      const resultado = this.generarResultadoModulo(
        sesion.respuestasCorrectas || 0,
        MODULOS[moduloUsuario].preguntas.length,
        moduloUsuario,
      );
      await this.whatsappService.enviarMensaje(numeroUsuario, resultado);

      // Verificar si hay más módulos
      if (moduloUsuario < 6) {
        // Avanzar al siguiente módulo para este usuario específico
        const siguienteModulo = moduloUsuario + 1;

        // Actualizar la sesión con el nuevo módulo
        this.sessionService.actualizarSesionUsuario(numeroUsuario, {
          ...sesion,
          modulo: siguienteModulo,
        });

        // Pequeña pausa antes de continuar con el siguiente módulo
        setTimeout(async () => {
          try {
            // Enviar video del siguiente módulo (no bloquea)
            await this.enviarVideoTutorial(numeroUsuario, siguienteModulo);

            // Esperar un poco más antes de iniciar el formulario del siguiente módulo
            setTimeout(async () => {
              try {
                await this.iniciarFormulario(numeroUsuario);
              } catch (formError) {
                this.logger.error(
                  `Error iniciando formulario del módulo ${siguienteModulo} para usuario ${numeroUsuario}:`,
                  formError,
                );
                await this.whatsappService.enviarMensaje(
                  numeroUsuario,
                  showPruebaTips
                    ? "⚠️ Error al continuar. Escribe 'prueba' para reiniciar."
                    : '⚠️ Error al continuar.',
                );
              }
            }, 2000);
          } catch (videoError) {
            this.logger.error(
              `Error enviando video del módulo ${siguienteModulo} para usuario ${numeroUsuario}:`,
              videoError,
            );
            // Continuar sin video
            setTimeout(async () => {
              try {
                await this.iniciarFormulario(numeroUsuario);
              } catch (formError) {
                this.logger.error(`Error iniciando formulario:`, formError);
              }
            }, 1000);
          }
        }, 3000);

        return null;
      } else {
        // Todos los módulos completados - mostrar mensaje final y enviar certificado
        const mensajeFinal = this.generarMensajeFinal(sesion.resultadosModulos);
        await this.whatsappService.enviarMensaje(numeroUsuario, mensajeFinal);

        // Esperar un poco antes de enviar certificado y encuesta
        setTimeout(async () => {
          try {
            await this.enviarCertificadoYEncuesta(numeroUsuario, sesion.resultadosModulos || []);
          } catch (certError) {
            this.logger.error(`Error enviando certificado:`, certError);
            // Intentar al menos enviar un mensaje de felicitación
            try {
              await this.whatsappService.enviarMensaje(
                numeroUsuario,
                '🎉 ¡Felicitaciones! Has completado todos los módulos del curso. 🏆',
              );
            } catch (e) {
              this.logger.error('Error enviando mensaje de felicitación:', e);
            }
          }
        }, 2000);

        return null; // No retornar mensaje ya que se envía por separado
      }
    }
  }

  /**
   * Genera mensaje de resultado del módulo completado
   */
  generarResultadoModulo(respuestasCorrectas: number, totalPreguntas: number, moduloNumero: number): string {
    const porcentaje = (respuestasCorrectas / totalPreguntas) * 100;

    let mensaje = `🎉 ¡${MODULOS[moduloNumero].titulo} completado!\n\n`;
    mensaje += `📊 Resultado: ${respuestasCorrectas}/${totalPreguntas} respuestas correctas (${porcentaje.toFixed(1)}%)\n\n`;

    if (porcentaje >= 80) {
      mensaje += `🏆 ¡Excelente! Has dominado este módulo.`;
    } else if (porcentaje >= 60) {
      mensaje += `👍 ¡Bien hecho! Tienes una buena base en este tema.`;
    } else {
      mensaje += `📚 Es importante reforzar estos conceptos.`;
    }

    if (moduloNumero < 6) {
      mensaje += `\n\n🎬 Continuemos con el siguiente módulo...`;
    }

    return mensaje;
  }

  /**
   * Genera mensaje final con resumen de todos los módulos
   */
  generarMensajeFinal(resultadosModulos: any[]): string {
    let mensaje = `🎉 ¡Felicitaciones! 🎉\n\n`;
    mensaje += `Has completado con éxito los 6 módulos del curso de Concientización en Seguridad Digital. Ahora estás mejor preparado para identificar y protegerte de amenazas como el phishing y otros riesgos en línea.\n\n`;

    // Mostrar resumen de resultados
    mensaje += `📊 **Resumen de tus resultados:**\n\n`;

    let totalCorrectas = 0;
    let totalPreguntas = 0;

    resultadosModulos.forEach((resultado, index) => {
      mensaje += `${index + 1}. ${resultado.titulo.replace('✅ ', '')}\n`;
      mensaje += `   📈 ${resultado.respuestasCorrectas}/${resultado.totalPreguntas} (${resultado.porcentaje.toFixed(1)}%)\n\n`;
      totalCorrectas += resultado.respuestasCorrectas;
      totalPreguntas += resultado.totalPreguntas;
    });

    const porcentajeTotal = (totalCorrectas / totalPreguntas) * 100;
    mensaje += `🏆 **Puntuación total: ${totalCorrectas}/${totalPreguntas} (${porcentajeTotal.toFixed(1)}%)**\n\n`;

    mensaje += `Gracias a todo lo aprendido, tienes las herramientas necesarias para mantener tu información personal segura y navegar de manera más protegida.\n\n`;
    mensaje += `**Recuerda siempre:**\n`;
    mensaje += `• Crea contraseñas seguras y únicas.\n`;
    mensaje += `• Identifica correos falsos y phishing.\n`;
    mensaje += `• Verifica antes de hacer clic en enlaces sospechosos.\n`;
    mensaje += `• Reporta cualquier incidente de seguridad.\n\n`;
    mensaje += `¡Tu seguridad digital es lo más importante! Gracias por completar este curso y estar un paso más cerca de una navegación segura.\n\n`;
    mensaje += `¡Estás listo para defenderte de las amenazas cibernéticas! 🛡️💻`;

    return mensaje;
  }

  /**
   * Genera resumen de progreso parcial cuando el usuario escribe "salir"
   */
  generarResumenParcial(
    resultadosModulos: any[],
    moduloActual: number,
    respuestasCorrectasActual: number,
    preguntaActual: number,
  ): string {
    this.logger.debug('=== DEBUG generarResumenParcial ===');
    this.logger.debug('resultadosModulos:', resultadosModulos);
    this.logger.debug('moduloActual:', moduloActual);
    this.logger.debug('respuestasCorrectas:', respuestasCorrectasActual);
    this.logger.debug('totalPreguntas:', preguntaActual);

    let mensaje = `📊 **Resumen de tu progreso:**\n\n`;

    // Mostrar módulos completados
    if (resultadosModulos && resultadosModulos.length > 0) {
      mensaje += `**Módulos completados:**\n`;
      resultadosModulos.forEach((resultado, index) => {
        mensaje += `${index + 1}. ${resultado.titulo.replace('✅ ', '')}\n`;
        mensaje += `   📈 ${resultado.respuestasCorrectas}/${resultado.totalPreguntas} (${resultado.porcentaje.toFixed(1)}%)\n\n`;
      });
    } else {
      mensaje += `**Módulos completados:** Ninguno\n\n`;
    }

    // Mostrar módulo actual si está en progreso
    if (preguntaActual > 0) {
      const porcentajeActual = (respuestasCorrectasActual / preguntaActual) * 100;
      mensaje += `**Módulo actual (${moduloActual}):**\n`;
      mensaje += `📈 ${respuestasCorrectasActual}/${preguntaActual} (${porcentajeActual.toFixed(1)}%) - En progreso\n\n`;
    } else {
      // Mostrar información del módulo actual aunque no haya progreso
      if (moduloActual && MODULOS[moduloActual]) {
        mensaje += `**Módulo actual (${moduloActual}):**\n`;
        mensaje += `${MODULOS[moduloActual].titulo}\n`;
        mensaje += `📈 No has respondido preguntas aún\n\n`;
      }
    }

    const showPruebaTips = this.configService.get<boolean>('MOSTRAR_TIP_PRUEBA', true);
    mensaje += showPruebaTips
      ? `Puedes retomar el curso en cualquier momento escribiendo 'prueba'. ¡Nos vemos pronto! 👋`
      : `Gracias por tu participación. ¡Nos vemos pronto! 👋`;

    return mensaje;
  }

  /**
   * Envía certificado y comienza la encuesta de satisfacción
   */
  async enviarCertificadoYEncuesta(numeroUsuario: string, resultadosModulos: any[]): Promise<void> {
    // Primero enviar el certificado (desde DigitalOcean CDN)
    const certificadoUrl =
      'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/Certificado-curso-Phishing.jpg';
    await this.whatsappService.enviarImagen(
      numeroUsuario,
      certificadoUrl,
      '🎉 ¡Felicitaciones! Has completado el curso de Concientización en Seguridad Digital. Aquí tienes tu certificado.',
    );

    // Esperar un poco antes de enviar la encuesta
    setTimeout(async () => {
      const mensajeEncuesta = `Tu opinión es muy valiosa para nosotros. Por favor, tómate 1 minuto para responder esta breve encuesta y ayudarnos a mejorar.\n\n👉 Solo haz clic en las opciones que mejor representen tu experiencia.\n\n¡Tus respuestas son anónimas y nos ayudarán a crear mejores contenidos para todos! 🙌\n\n📝 **Encuesta de Satisfacción - Curso de Phishing**`;

      await this.whatsappService.enviarMensaje(numeroUsuario, mensajeEncuesta);

      // Iniciar la encuesta
      setTimeout(() => {
        this.surveyService.iniciarEncuesta(numeroUsuario);
      }, 2000);
    }, 3000);
  }
}
