"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SurveyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyService = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
const session_service_1 = require("./session.service");
const database_service_1 = require("../database/database.service");
const survey_constant_1 = require("../course/constants/survey.constant");
let SurveyService = SurveyService_1 = class SurveyService {
    whatsappService;
    sessionService;
    databaseService;
    logger = new common_1.Logger(SurveyService_1.name);
    constructor(whatsappService, sessionService, databaseService) {
        this.whatsappService = whatsappService;
        this.sessionService = sessionService;
        this.databaseService = databaseService;
    }
    async iniciarEncuesta(numeroUsuario) {
        try {
            this.logger.log(`📋 Iniciando encuesta para usuario: ${numeroUsuario}`);
            this.sessionService.actualizarSesionUsuario(numeroUsuario, {
                enEncuesta: true,
                enFormulario: false,
                respuestasEncuesta: [],
            });
            await this.enviarPreguntaEncuesta(numeroUsuario, 0);
        }
        catch (error) {
            this.logger.error(`Error iniciando encuesta para ${numeroUsuario}:`, error);
            throw error;
        }
    }
    async enviarPreguntaEncuesta(numeroUsuario, indicePregunta) {
        try {
            if (indicePregunta >= survey_constant_1.PREGUNTAS_ENCUESTA.length) {
                this.logger.warn(`Índice de pregunta ${indicePregunta} fuera de rango para usuario ${numeroUsuario}`);
                return;
            }
            const pregunta = survey_constant_1.PREGUNTAS_ENCUESTA[indicePregunta];
            this.logger.log(`📤 Enviando pregunta ${indicePregunta + 1}/${survey_constant_1.PREGUNTAS_ENCUESTA.length} a ${numeroUsuario}`);
            let mensajePregunta = `${pregunta.pregunta}\n\n`;
            pregunta.opciones.forEach((opcion, index) => {
                mensajePregunta += `${opcion}\n`;
            });
            if (pregunta.ids.length <= 3) {
                const botones = pregunta.ids.map((id, index) => ({
                    type: 'reply',
                    reply: {
                        id: id,
                        title: String.fromCharCode(65 + index),
                    },
                }));
                await this.whatsappService.enviarBotonesOpciones(numeroUsuario, mensajePregunta, botones);
            }
            else {
                mensajePregunta +=
                    '\n💡 Responde con el número de tu opción (1, 2, 3...)';
                await this.whatsappService.enviarMensaje(numeroUsuario, mensajePregunta);
            }
            this.logger.log(`✅ Pregunta ${indicePregunta + 1} enviada a ${numeroUsuario}`);
        }
        catch (error) {
            this.logger.error(`Error enviando pregunta ${indicePregunta} a ${numeroUsuario}:`, error);
            throw error;
        }
    }
    async procesarRespuestaEncuesta(numeroUsuario, message) {
        try {
            const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);
            if (!sesion || !sesion.enEncuesta) {
                this.logger.warn(`Usuario ${numeroUsuario} no tiene sesión de encuesta activa`);
                return null;
            }
            const indicePreguntaActual = sesion.respuestasEncuesta?.length || 0;
            const preguntaActual = survey_constant_1.PREGUNTAS_ENCUESTA[indicePreguntaActual];
            if (!preguntaActual) {
                this.logger.warn(`No hay pregunta para índice ${indicePreguntaActual} para usuario ${numeroUsuario}`);
                return null;
            }
            let respuestaId = null;
            if (message.interactive?.button_reply?.id) {
                respuestaId = message.interactive.button_reply.id;
                this.logger.log(`📥 Respuesta de botón recibida de ${numeroUsuario}: ${respuestaId}`);
            }
            else if (message.text?.body) {
                const textoRespuesta = message.text.body.trim();
                const numeroRespuesta = parseInt(textoRespuesta, 10);
                if (!isNaN(numeroRespuesta) &&
                    numeroRespuesta >= 1 &&
                    numeroRespuesta <= preguntaActual.ids.length) {
                    respuestaId = preguntaActual.ids[numeroRespuesta - 1];
                    this.logger.log(`📥 Respuesta de texto recibida de ${numeroUsuario}: ${textoRespuesta} -> ${respuestaId}`);
                }
                else {
                    this.logger.warn(`Respuesta inválida de ${numeroUsuario}: "${textoRespuesta}"`);
                    await this.whatsappService.enviarMensaje(numeroUsuario, `⚠️ Respuesta no válida. Por favor, responde con un número del 1 al ${preguntaActual.ids.length} o selecciona un botón.`);
                    return null;
                }
            }
            if (!respuestaId) {
                this.logger.warn(`No se pudo extraer respuesta válida del mensaje de ${numeroUsuario}`);
                return null;
            }
            const respuestasEncuesta = sesion.respuestasEncuesta || [];
            respuestasEncuesta.push({
                pregunta: preguntaActual.numero,
                respuesta: respuestaId,
                timestamp: new Date(),
            });
            this.sessionService.actualizarSesionUsuario(numeroUsuario, {
                respuestasEncuesta,
            });
            this.logger.log(`✅ Respuesta guardada: Usuario ${numeroUsuario}, Pregunta ${preguntaActual.numero}, Respuesta: ${respuestaId}`);
            const siguienteIndice = indicePreguntaActual + 1;
            if (siguienteIndice < survey_constant_1.PREGUNTAS_ENCUESTA.length) {
                this.logger.log(`➡️ Enviando siguiente pregunta (${siguienteIndice + 1}/${survey_constant_1.PREGUNTAS_ENCUESTA.length}) a ${numeroUsuario}`);
                setTimeout(async () => {
                    try {
                        await this.enviarPreguntaEncuesta(numeroUsuario, siguienteIndice);
                    }
                    catch (error) {
                        this.logger.error(`Error enviando siguiente pregunta a ${numeroUsuario}:`, error);
                    }
                }, 1500);
                return null;
            }
            else {
                this.logger.log(`🎉 Encuesta completada para usuario ${numeroUsuario}`);
                try {
                    await this.databaseService.guardarRespuestasEncuesta(numeroUsuario, respuestasEncuesta, sesion.resultadosModulos || []);
                    this.logger.log(`💾 Respuestas de encuesta guardadas en DB para ${numeroUsuario}`);
                }
                catch (dbError) {
                    this.logger.error(`Error guardando encuesta en DB para ${numeroUsuario}:`, dbError);
                }
                this.sessionService.eliminarSesion(numeroUsuario);
                this.logger.log(`🗑️ Sesión eliminada para usuario ${numeroUsuario} tras completar encuesta`);
                return ('🎉 **¡Gracias por completar la encuesta!**\n\n' +
                    'Tu feedback es muy valioso para mejorar nuestros cursos.\n\n' +
                    '✅ **Has completado exitosamente:**\n' +
                    '• 6 módulos de seguridad digital\n' +
                    '• Certificado de finalización\n' +
                    '• Encuesta de satisfacción\n\n' +
                    '¡Esperamos que hayas disfrutado el curso! 🚀');
            }
        }
        catch (error) {
            this.logger.error(`Error procesando respuesta de encuesta para ${numeroUsuario}:`, error);
            throw error;
        }
    }
};
exports.SurveyService = SurveyService;
exports.SurveyService = SurveyService = SurveyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsAppService,
        session_service_1.SessionService,
        database_service_1.DatabaseService])
], SurveyService);
//# sourceMappingURL=survey.service.js.map