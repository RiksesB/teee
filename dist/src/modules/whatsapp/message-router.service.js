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
var MessageRouterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRouterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const whatsapp_service_1 = require("./whatsapp.service");
const session_service_1 = require("./session.service");
const course_service_1 = require("./course.service");
const survey_service_1 = require("./survey.service");
let MessageRouterService = MessageRouterService_1 = class MessageRouterService {
    configService;
    whatsappService;
    sessionService;
    courseService;
    surveyService;
    logger = new common_1.Logger(MessageRouterService_1.name);
    showPruebaTips;
    constructor(configService, whatsappService, sessionService, courseService, surveyService) {
        this.configService = configService;
        this.whatsappService = whatsappService;
        this.sessionService = sessionService;
        this.courseService = courseService;
        this.surveyService = surveyService;
        this.showPruebaTips = this.configService.get('MOSTRAR_TIP_PRUEBA') !== 'false';
        this.logger.log('MessageRouterService initialized');
        this.logger.log(`Show prueba tips: ${this.showPruebaTips}`);
    }
    async procesarMensajeUsuario(numeroUsuario, message) {
        let textoMensaje = "";
        let esRespuestaFormulario = false;
        let esRespuestaEncuesta = false;
        if (message.type === "text") {
            textoMensaje = message.text.body.toLowerCase().trim();
            this.logger.debug(`Mensaje de texto recibido: "${textoMensaje}"`);
        }
        else if (message.type === "button") {
            if (message.button?.payload === "prueba" ||
                message.button?.text === "prueba") {
                textoMensaje = "prueba";
                this.logger.log("Botón de plantilla detectado: iniciando prueba");
            }
            else if (message.button?.payload === "eINSERTAREMOJI" ||
                message.button?.text === "eINSERTAREMOJI") {
                textoMensaje = "eINSERTAREMOJI";
                this.logger.log("Botón eINSERTAREMOJI detectado: enviando imagen especial");
            }
        }
        else if (message.type === "interactive") {
            if (message.interactive.type === "button_reply") {
                const buttonId = message.interactive.button_reply.id;
                this.logger.debug(`Botón interactivo presionado: ${buttonId}`);
                if (buttonId === "iniciar_si") {
                    textoMensaje = "comenzar";
                }
                else if (buttonId === "iniciar_no") {
                    textoMensaje = "no_iniciar";
                }
                else if (buttonId.startsWith("respuesta_")) {
                    esRespuestaFormulario = true;
                    this.logger.debug("Detectada respuesta de formulario");
                }
                else if (buttonId.includes("duracion_") ||
                    buttonId.includes("comprension_") ||
                    buttonId.includes("dinamica_") ||
                    buttonId.includes("utilidad_") ||
                    buttonId.includes("recomendacion_")) {
                    esRespuestaEncuesta = true;
                    this.logger.debug("Detectada respuesta de encuesta");
                }
            }
            else if (message.interactive.type === "list_reply") {
                const listId = message.interactive.list_reply.id;
                this.logger.debug(`Respuesta de lista recibida: ${listId}`);
                if (listId.startsWith("respuesta_")) {
                    esRespuestaFormulario = true;
                    this.logger.debug("Detectada respuesta de formulario desde lista");
                }
            }
        }
        let respuesta = null;
        const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);
        try {
            if (esRespuestaFormulario && sesion?.enFormulario) {
                this.logger.log(`Procesando respuesta de formulario para usuario ${numeroUsuario}`);
                respuesta = await this.courseService.procesarRespuestaFormulario(numeroUsuario, message);
            }
            else if (esRespuestaEncuesta && sesion?.enEncuesta) {
                this.logger.log(`Procesando respuesta de encuesta para usuario ${numeroUsuario}`);
                respuesta = await this.surveyService.procesarRespuestaEncuesta(numeroUsuario, message);
            }
            else if (textoMensaje === "salir") {
                this.logger.log(`Usuario ${numeroUsuario} ejecutó comando salir`);
                this.logger.debug("=== DEBUG comando salir ===");
                this.logger.debug(`Sesión: ${JSON.stringify(sesion)}`);
                if (sesion &&
                    (sesion.enFormulario ||
                        sesion.estado === "viendo_video" ||
                        sesion.enEncuesta)) {
                    respuesta = this.courseService.generarResumenParcial(sesion.resultadosModulos || [], sesion.modulo || 1, sesion.respuestasCorrectas || 0, sesion.preguntaActual || 0, sesion);
                    this.sessionService.eliminarSesion(numeroUsuario);
                    this.logger.log(`Sesión eliminada para usuario ${numeroUsuario}`);
                }
                else {
                    respuesta = this.showPruebaTips
                        ? "No hay ninguna prueba activa. Escribe 'prueba' para comenzar."
                        : "No hay ninguna prueba activa.";
                }
            }
            else if (textoMensaje === "eINSERTAREMOJI") {
                this.logger.log(`Usuario ${numeroUsuario} ejecutó comando especial eINSERTAREMOJI`);
                try {
                    await this.whatsappService.enviarImagen(numeroUsuario, "https://i.chzbgr.com/full/6796713984/hF30B7124/furry-query", "😂 eINSERTAREMOJI");
                    respuesta = null;
                    this.logger.log("Imagen especial enviada exitosamente");
                }
                catch (error) {
                    this.logger.error(`Error enviando imagen especial: ${error.message}`, error.stack);
                    respuesta = "No pude enviar la imagen xd";
                }
            }
            else if (textoMensaje === "prueba") {
                this.logger.log(`Usuario ${numeroUsuario} ejecutó comando prueba`);
                await this.courseService.iniciarPruebaDirecta(numeroUsuario, false);
                respuesta = null;
            }
            else if (textoMensaje === "comenzar") {
                this.logger.log(`Usuario ${numeroUsuario} ejecutó comando comenzar`);
                if (!sesion) {
                    this.logger.debug("No hay sesión, iniciando prueba directamente");
                    await this.courseService.iniciarPruebaDirecta(numeroUsuario);
                    respuesta = null;
                }
                else if (sesion.estado === "viendo_video" ||
                    sesion.estado === "en_prueba") {
                    this.logger.debug(`Sesión en estado ${sesion.estado}, iniciando formulario`);
                    await this.courseService.iniciarFormulario(numeroUsuario);
                    respuesta = null;
                }
                else {
                    respuesta =
                        "Ya tienes una prueba en progreso. Continúa respondiendo las preguntas.";
                }
            }
            else if (textoMensaje === "no_iniciar") {
                this.logger.log(`Usuario ${numeroUsuario} rechazó iniciar la prueba`);
                this.sessionService.eliminarSesion(numeroUsuario);
                respuesta = this.showPruebaTips
                    ? "Está bien, puedes iniciar la prueba cuando quieras. Escribe 'prueba' para comenzar de nuevo."
                    : "Está bien, puedes iniciar la prueba cuando quieras.";
            }
            else if (sesion?.enFormulario) {
                this.logger.log(`Usuario ${numeroUsuario} tiene formulario activo, procesando mensaje como respuesta`);
                respuesta = await this.courseService.procesarRespuestaFormulario(numeroUsuario, message);
            }
            else if (sesion?.enEncuesta) {
                this.logger.log(`Usuario ${numeroUsuario} tiene encuesta activa, procesando mensaje como respuesta`);
                respuesta = await this.surveyService.procesarRespuestaEncuesta(numeroUsuario, message);
            }
            else if (!esRespuestaFormulario && !esRespuestaEncuesta) {
                this.logger.debug(`Respuesta echo para usuario ${numeroUsuario}`);
                const echoText = "Echo: " +
                    (message.type === "text" ? message.text.body : "Mensaje interactivo");
                const tipText = this.showPruebaTips
                    ? "\n\n💡 Tip: Escribe 'prueba' para iniciar el curso de seguridad digital.\n📤 Escribe 'salir' en cualquier momento para abandonar la prueba."
                    : "\n\n📤 Escribe 'salir' en cualquier momento para abandonar la prueba.";
                respuesta = echoText + tipText;
            }
            if (respuesta) {
                this.logger.debug(`Enviando respuesta a ${numeroUsuario}: ${respuesta.substring(0, 100)}...`);
                await this.whatsappService.enviarMensaje(numeroUsuario, respuesta);
            }
            else {
                this.logger.debug(`No se envía respuesta (manejada internamente)`);
            }
        }
        catch (error) {
            this.logger.error(`Error procesando mensaje de usuario ${numeroUsuario}: ${error.message}`, error.stack);
            try {
                await this.whatsappService.enviarMensaje(numeroUsuario, "❌ Ocurrió un error procesando tu mensaje. Por favor intenta de nuevo.");
            }
            catch (sendError) {
                this.logger.error(`Error enviando mensaje de error: ${sendError.message}`, sendError.stack);
            }
        }
    }
};
exports.MessageRouterService = MessageRouterService;
exports.MessageRouterService = MessageRouterService = MessageRouterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        whatsapp_service_1.WhatsAppService,
        session_service_1.SessionService,
        course_service_1.CourseService,
        survey_service_1.SurveyService])
], MessageRouterService);
//# sourceMappingURL=message-router.service.js.map