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
var CourseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
const session_service_1 = require("./session.service");
const database_service_1 = require("../database/database.service");
const survey_service_1 = require("./survey.service");
const config_1 = require("@nestjs/config");
const courses_service_1 = require("../courses/courses.service");
const modules_constant_1 = require("../course/constants/modules.constant");
const axios_1 = require("axios");
let CourseService = CourseService_1 = class CourseService {
    whatsappService;
    sessionService;
    databaseService;
    surveyService;
    configService;
    coursesService;
    logger = new common_1.Logger(CourseService_1.name);
    constructor(whatsappService, sessionService, databaseService, surveyService, configService, coursesService) {
        this.whatsappService = whatsappService;
        this.sessionService = sessionService;
        this.databaseService = databaseService;
        this.surveyService = surveyService;
        this.configService = configService;
        this.coursesService = coursesService;
    }
    getModuloData(sesion, moduloIndex) {
        if (sesion.courseData && sesion.courseData.modules) {
            const modulo = sesion.courseData.modules[moduloIndex - 1];
            if (!modulo) {
                throw new Error(`Módulo ${moduloIndex} no encontrado en el curso ${sesion.courseData.title}`);
            }
            return {
                titulo: modulo.title,
                preguntas: modulo.questions.map((q, index) => ({
                    numero: index + 1,
                    pregunta: q.question,
                    opciones: q.options,
                    respuesta_correcta: q.correctAnswer,
                    retroalimentacion: q.feedback,
                })),
                videoUrl: modulo.videoUrl,
            };
        }
        else {
            return modules_constant_1.MODULOS[moduloIndex];
        }
    }
    getVideoUrl(sesion, moduloIndex) {
        if (sesion.courseData && sesion.courseData.modules) {
            const modulo = sesion.courseData.modules[moduloIndex - 1];
            return modulo?.videoUrl || '';
        }
        else {
            return modules_constant_1.VIDEOS_MODULOS[moduloIndex];
        }
    }
    getTotalModulos(sesion) {
        if (sesion.courseData && sesion.courseData.modules) {
            return sesion.courseData.modules.length;
        }
        else {
            return 6;
        }
    }
    randomizarOpciones(pregunta, quitarUnaIncorrecta = false) {
        let indicesOriginales = pregunta.opciones.map((_, i) => i);
        if (pregunta.opciones.length === 4 && quitarUnaIncorrecta && Math.random() > 0.5) {
            const indiceCorrectoOriginal = pregunta.respuesta_correcta.charCodeAt(0) - 65;
            const indicesIncorrectos = indicesOriginales.filter(i => i !== indiceCorrectoOriginal);
            const indiceAQuitar = indicesIncorrectos[Math.floor(Math.random() * indicesIncorrectos.length)];
            indicesOriginales.splice(indicesOriginales.indexOf(indiceAQuitar), 1);
            this.logger.debug(`🎲 Pregunta de 4 opciones: Quitada opción ${String.fromCharCode(65 + indiceAQuitar)} incorrecta`);
        }
        for (let i = indicesOriginales.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indicesOriginales[i], indicesOriginales[j]] = [indicesOriginales[j], indicesOriginales[i]];
        }
        const opcionesRandomizadas = [];
        const mapeoRespuestas = {};
        const mapeoRetroalimentacion = {};
        indicesOriginales.forEach((indiceOriginal, nuevoIndice) => {
            const letraOriginal = String.fromCharCode(65 + indiceOriginal);
            const letraNueva = String.fromCharCode(65 + nuevoIndice);
            const textoOpcion = pregunta.opciones[indiceOriginal];
            const nuevaLetra = String.fromCharCode(97 + nuevoIndice);
            opcionesRandomizadas.push(`${nuevaLetra}) ${textoOpcion.substring(3)}`);
            mapeoRespuestas[letraNueva] = letraOriginal;
            mapeoRetroalimentacion[letraNueva] = pregunta.retroalimentacion[letraOriginal];
        });
        const letraCorrectaOriginal = pregunta.respuesta_correcta;
        const letraCorrectaNueva = Object.keys(mapeoRespuestas).find(key => mapeoRespuestas[key] === letraCorrectaOriginal);
        return {
            opcionesRandomizadas,
            mapeoRespuestas,
            mapeoRetroalimentacion,
            respuestaCorrectaNueva: letraCorrectaNueva || 'A',
        };
    }
    async enviarPregunta(numeroUsuario, indicePregunta) {
        const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);
        if (!sesion || !sesion.modulo) {
            this.logger.error(`No hay sesión activa para usuario ${numeroUsuario}`);
            return;
        }
        const moduloUsuario = sesion.modulo;
        const moduloData = this.getModuloData(sesion, moduloUsuario);
        const preguntaOriginal = moduloData.preguntas[indicePregunta];
        const randomizado = this.randomizarOpciones(preguntaOriginal, true);
        if (!sesion.mapeosPreguntas) {
            sesion.mapeosPreguntas = {};
        }
        sesion.mapeosPreguntas[indicePregunta] = {
            mapeoRespuestas: randomizado.mapeoRespuestas,
            mapeoRetroalimentacion: randomizado.mapeoRetroalimentacion,
            respuestaCorrectaNueva: randomizado.respuestaCorrectaNueva,
        };
        const preguntaParaMostrar = {
            numero: preguntaOriginal.numero,
            pregunta: preguntaOriginal.pregunta,
            opciones: randomizado.opcionesRandomizadas,
        };
        const numOpciones = preguntaParaMostrar.opciones.length;
        this.logger.debug(`🎲 Opciones randomizadas para ${numeroUsuario}: ${numOpciones} opciones, correcta: ${randomizado.respuestaCorrectaNueva}`);
        if (numOpciones > 3) {
            this.logger.log(`📝 Enviando pregunta con lista (${numOpciones} opciones) para ${numeroUsuario}`);
            await this.enviarPreguntaConListaCustom(numeroUsuario, indicePregunta, preguntaParaMostrar);
        }
        else {
            this.logger.log(`📝 Enviando pregunta con botones (${numOpciones} opciones) para ${numeroUsuario}`);
            await this.enviarPreguntaConBotonesCustom(numeroUsuario, indicePregunta, preguntaParaMostrar);
        }
    }
    async enviarPreguntaConBotonesCustom(numeroUsuario, indicePregunta, preguntaCustom) {
        try {
            let mensaje = `🟡 Pregunta ${preguntaCustom.numero}:\n${preguntaCustom.pregunta}\n\n`;
            preguntaCustom.opciones.forEach((opcion) => {
                mensaje += `${opcion}\n`;
            });
            mensaje += `\n💡 Selecciona tu respuesta:`;
            const botones = preguntaCustom.opciones.map((_, index) => {
                const letra = String.fromCharCode(97 + index);
                return {
                    type: 'reply',
                    reply: {
                        id: `respuesta_${letra}_${indicePregunta}`,
                        title: letra.toUpperCase(),
                    },
                };
            });
            await this.whatsappService.enviarBotonesOpciones(numeroUsuario, mensaje, botones);
        }
        catch (error) {
            this.logger.error(`Error enviando pregunta con botones: ${error}`);
            try {
                let mensajeFallback = `🔴 Pregunta ${preguntaCustom.numero}:\n${preguntaCustom.pregunta}\n\n`;
                preguntaCustom.opciones.forEach((opcion) => {
                    mensajeFallback += `${opcion}\n`;
                });
                mensajeFallback += `\n💡 Responde con: A, B o C`;
                await this.whatsappService.enviarMensaje(numeroUsuario, mensajeFallback);
            }
            catch (fallbackError) {
                this.logger.error('Error en fallback:', fallbackError);
            }
        }
    }
    async enviarPreguntaConListaCustom(numeroUsuario, indicePregunta, preguntaCustom) {
        try {
            const rows = preguntaCustom.opciones.map((opcion, index) => {
                const letra = String.fromCharCode(65 + index);
                return {
                    id: `respuesta_${letra.toLowerCase()}_${indicePregunta}`,
                    title: letra,
                    description: opcion.length > 72 ? opcion.substring(0, 69) + '...' : opcion,
                };
            });
            const apiVersion = this.configService.get('WHATSAPP_API_VERSION');
            const businessPhone = this.configService.get('WHATSAPP_BUSINESS_PHONE');
            const apiToken = this.configService.get('WHATSAPP_API_TOKEN');
            await (0, axios_1.default)({
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
        }
        catch (error) {
            this.logger.error(`Error enviando lista:`, error.response?.data || error.message);
            try {
                let mensajeFallback = `🟡 Pregunta ${preguntaCustom.numero}:\n${preguntaCustom.pregunta}\n\n`;
                preguntaCustom.opciones.forEach((opcion) => {
                    mensajeFallback += `${opcion}\n`;
                });
                mensajeFallback += `\n💡 Responde con la letra (A, B, C, D, etc.)`;
                await this.whatsappService.enviarMensaje(numeroUsuario, mensajeFallback);
            }
            catch (fallbackError) {
                this.logger.error('Error en fallback:', fallbackError);
            }
        }
    }
    async iniciarPruebaDirecta(numeroUsuario, usarPlantilla = false, courseId) {
        if (!numeroUsuario || typeof numeroUsuario !== 'string' || numeroUsuario.trim() === '') {
            throw new Error(`Número de teléfono inválido: ${numeroUsuario}`);
        }
        let courseData = null;
        if (courseId) {
            try {
                courseData = await this.coursesService.findOne(courseId);
                this.logger.log(`📚 Curso cargado desde MongoDB: ${courseData.title} (ID: ${courseId})`);
                if (!courseData.modules || courseData.modules.length === 0) {
                    throw new Error(`El curso ${courseId} no tiene módulos configurados`);
                }
            }
            catch (error) {
                this.logger.error(`❌ Error cargando curso ${courseId}:`, error);
                throw new Error(`No se pudo cargar el curso: ${error.message}`);
            }
        }
        else {
            this.logger.log(`📚 Usando curso por defecto (hardcodeado)`);
        }
        if (this.sessionService.obtenerSesionUsuario(numeroUsuario)) {
            const sesionAnterior = this.sessionService.obtenerSesionUsuario(numeroUsuario);
            this.logger.log(`🧹 Limpiando sesión anterior para ${numeroUsuario} (estaba en módulo ${sesionAnterior?.modulo || 'desconocido'})`);
            this.sessionService.eliminarSesion(numeroUsuario);
        }
        const sessionData = {
            estado: 'en_prueba',
            iniciadoEn: new Date(),
            ultimaActividad: new Date(),
            modulo: 1,
            resultadosModulos: [],
            numeroUsuario: numeroUsuario,
            respuestasDetalladas: [],
            courseData,
            courseId,
        };
        this.sessionService.crearSesion(numeroUsuario, 1);
        this.sessionService.actualizarSesionUsuario(numeroUsuario, sessionData);
        this.logger.log(`🆕 Nueva sesión creada para ${numeroUsuario}: Módulo 1${courseId ? ` - Curso: ${courseData.title}` : ' - Curso por defecto'}`);
        await this.databaseService.guardarDatosUsuario({
            ...sessionData,
            evento: 'inicio_curso',
            usarPlantilla,
            courseId,
        });
        try {
            this.logger.log(`🔍 DEBUG: usarPlantilla = ${usarPlantilla} para ${numeroUsuario}`);
            this.logger.log(`🎬 Intentando enviar video tutorial para ${numeroUsuario}, módulo ${sessionData.modulo}`);
            try {
                await this.enviarVideoTutorial(numeroUsuario, sessionData.modulo);
                this.logger.log(`✅ Video tutorial enviado exitosamente para ${numeroUsuario}`);
            }
            catch (videoError) {
                this.logger.error(`❌ Error enviando video tutorial: ${videoError}`);
                this.logger.error(`Stack trace:`, videoError.stack);
            }
            this.logger.log(`⏰ Programando inicio de formulario en 2 segundos para ${numeroUsuario}`);
            setTimeout(async () => {
                this.logger.log(`🔄 Ejecutando setTimeout: iniciando formulario para ${numeroUsuario}`);
                try {
                    await this.iniciarFormulario(numeroUsuario);
                    this.logger.log(`✅ Formulario iniciado exitosamente para ${numeroUsuario}`);
                }
                catch (formError) {
                    this.logger.error(`❌ Error iniciando formulario: ${formError}`);
                    this.logger.error(`Stack trace:`, formError.stack);
                    try {
                        const showPruebaTips = this.configService.get('MOSTRAR_TIP_PRUEBA', true);
                        const tip = showPruebaTips
                            ? " Escribe 'prueba' para reintentar."
                            : ' Inténtalo de nuevo más tarde.';
                        await this.whatsappService.enviarMensaje(numeroUsuario, `⚠️ Hubo un problema.${tip}`);
                    }
                    catch (e) {
                        this.logger.error('No se pudo notificar al usuario:', e);
                    }
                }
            }, 2000);
            this.logger.log(`✅ iniciarPruebaDirecta completado para ${numeroUsuario} (setTimeout programado)`);
        }
        catch (error) {
            this.logger.error(`Error iniciando prueba para ${numeroUsuario}:`, error);
            const errorCode = error.response?.data?.error?.code ||
                error.response?.data?.error?.error_data?.code ||
                (error.response?.data?.error &&
                    error.response.data.error.find &&
                    error.response.data.error.find((e) => e.code === 131047)?.code);
            if (!usarPlantilla && (errorCode === 131047 || error.message?.includes('131047'))) {
                this.logger.log('🔄 Error 131047 detectado - Reintentando con plantilla...');
                this.logger.log('Error original:', JSON.stringify(error.response?.data, null, 2));
                return this.iniciarPruebaDirecta(numeroUsuario, true);
            }
            throw error;
        }
    }
    async enviarVideoTutorial(numeroUsuario, moduloActual) {
        const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);
        const videoUrl = this.getVideoUrl(sesion, moduloActual);
        if (!videoUrl) {
            this.logger.warn(`No hay video configurado para módulo ${moduloActual}`);
            return;
        }
        const caption = `🎬 Video Tutorial - Módulo ${moduloActual}\n\n` +
            `📹 Te recomendamos ver este video para aprender sobre el tema.\n\n` +
            `💡 Puedes continuar con las preguntas cuando quieras.`;
        try {
            await this.whatsappService.enviarVideo(numeroUsuario, videoUrl, caption);
            this.logger.log(`Video del módulo ${moduloActual} enviado exitosamente`);
        }
        catch (error) {
            this.logger.error('Error enviando video, usando fallback:', error);
            const mensajeFallback = `🎬 Video Tutorial - Módulo ${moduloActual}\n\n` +
                `📹 Puedes ver el video en: ${videoUrl}\n\n` +
                `💡 Te recomendamos verlo para aprender sobre el tema.`;
            await this.whatsappService.enviarMensaje(numeroUsuario, mensajeFallback);
        }
    }
    async iniciarFormulario(numeroUsuario) {
        try {
            this.logger.log(`📝 Iniciando formulario para usuario ${numeroUsuario}`);
            const sesionAnterior = this.sessionService.obtenerSesionUsuario(numeroUsuario);
            const moduloUsuario = sesionAnterior?.modulo || 1;
            let moduloData;
            try {
                moduloData = this.getModuloData(sesionAnterior, moduloUsuario);
            }
            catch (error) {
                this.logger.error(`Módulo ${moduloUsuario} no existe para usuario ${numeroUsuario}: ${error.message}`);
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
            this.logger.log(`📋 Enviando título del módulo ${moduloUsuario} a ${numeroUsuario}`);
            await this.whatsappService.enviarMensaje(numeroUsuario, moduloData.titulo);
            setTimeout(async () => {
                try {
                    await this.enviarPregunta(numeroUsuario, 0);
                }
                catch (error) {
                    this.logger.error(`Error enviando primera pregunta a ${numeroUsuario}:`, error);
                }
            }, 1500);
        }
        catch (error) {
            this.logger.error(`Error iniciando formulario para ${numeroUsuario}:`, error);
            throw error;
        }
    }
    async procesarRespuestaFormulario(numeroUsuario, message) {
        const sesion = this.sessionService.obtenerSesionUsuario(numeroUsuario);
        const showPruebaTips = this.configService.get('MOSTRAR_TIP_PRUEBA', true);
        if (!sesion || !sesion.enFormulario) {
            return showPruebaTips
                ? "No tienes un formulario activo. Escribe 'prueba' para comenzar."
                : 'No tienes un formulario activo.';
        }
        let respuestaSeleccionada;
        if (message.type === 'interactive') {
            if (message.interactive.type === 'button_reply') {
                const buttonId = message.interactive.button_reply.id;
                if (buttonId.startsWith('respuesta_')) {
                    const letra = buttonId.split('_')[1];
                    respuestaSeleccionada = letra.toUpperCase();
                }
            }
            else if (message.interactive.type === 'list_reply') {
                const listId = message.interactive.list_reply.id;
                if (listId.startsWith('respuesta_')) {
                    const letra = listId.split('_')[1];
                    respuestaSeleccionada = letra.toUpperCase();
                    this.logger.log(`📋 Respuesta de lista recibida: ${respuestaSeleccionada}`);
                }
            }
        }
        else if (message.type === 'text') {
            const textoRespuesta = message.text.body.trim().toLowerCase();
            if (/^[a-z]$/.test(textoRespuesta)) {
                respuestaSeleccionada = textoRespuesta.toUpperCase();
            }
            else {
                await this.whatsappService.enviarMensaje(numeroUsuario, 'Por favor, responde con los botones/lista o escribe una letra (A, B, C, D, etc.)');
                return null;
            }
        }
        if (!respuestaSeleccionada) {
            await this.whatsappService.enviarMensaje(numeroUsuario, 'Por favor, selecciona una opción.');
            return null;
        }
        const moduloUsuario = sesion.modulo;
        const preguntaActualIndex = sesion.preguntaActual ?? 0;
        const moduloData = this.getModuloData(sesion, moduloUsuario);
        const preguntaOriginal = moduloData.preguntas[preguntaActualIndex];
        const mapeo = sesion.mapeosPreguntas?.[preguntaActualIndex];
        let respuestaCorrecta;
        let retroalimentacion;
        let respuestaOriginal;
        if (mapeo) {
            respuestaOriginal = mapeo.mapeoRespuestas[respuestaSeleccionada];
            respuestaCorrecta = respuestaSeleccionada === mapeo.respuestaCorrectaNueva;
            retroalimentacion = mapeo.mapeoRetroalimentacion[respuestaSeleccionada];
            this.logger.log(`🎲 Mapeo usado: ${respuestaSeleccionada} → ${respuestaOriginal} original`);
        }
        else {
            respuestaOriginal = respuestaSeleccionada;
            respuestaCorrecta = respuestaSeleccionada === preguntaOriginal.respuesta_correcta;
            retroalimentacion = preguntaOriginal.retroalimentacion[respuestaSeleccionada];
            this.logger.warn(`⚠️ Sin mapeo, usando respuesta directa`);
        }
        if (respuestaCorrecta) {
            sesion.respuestasCorrectas = (sesion.respuestasCorrectas || 0) + 1;
        }
        if (!sesion.respuestasDetalladas) {
            sesion.respuestasDetalladas = [];
        }
        this.logger.log(`📝 Usuario ${numeroUsuario} - Módulo ${moduloUsuario}, Pregunta ${preguntaActualIndex + 1}: Respuesta ${respuestaSeleccionada} (${respuestaCorrecta ? '✅ Correcta' : '❌ Incorrecta'})`);
        sesion.respuestasDetalladas.push({
            pregunta: preguntaActualIndex + 1,
            preguntaTexto: preguntaOriginal.pregunta,
            respuestaSeleccionada,
            respuestaOriginal,
            respuestaCorrecta: preguntaOriginal.respuesta_correcta,
            esCorrecta: respuestaCorrecta,
            timestamp: new Date(),
        });
        if (retroalimentacion) {
            await this.whatsappService.enviarMensaje(numeroUsuario, retroalimentacion);
        }
        sesion.preguntaActual = preguntaActualIndex + 1;
        sesion.ultimaActividad = new Date();
        if (sesion.preguntaActual < moduloData.preguntas.length) {
            setTimeout(async () => {
                try {
                    await this.enviarPregunta(numeroUsuario, sesion.preguntaActual);
                }
                catch (error) {
                    this.logger.error(`Error enviando pregunta ${sesion.preguntaActual}:`, error);
                }
            }, 2000);
            return null;
        }
        else {
            const resultadoModulo = {
                modulo: moduloUsuario,
                titulo: moduloData.titulo,
                respuestasCorrectas: sesion.respuestasCorrectas || 0,
                totalPreguntas: moduloData.preguntas.length,
                porcentaje: ((sesion.respuestasCorrectas || 0) / moduloData.preguntas.length) * 100,
            };
            sesion.resultadosModulos = sesion.resultadosModulos || [];
            sesion.resultadosModulos.push(resultadoModulo);
            await this.databaseService.guardarRespuestasFormulario(numeroUsuario, moduloUsuario, {
                resultadoModulo,
                respuestasDetalladas: sesion.respuestasDetalladas || [],
                fecha_completado: new Date(),
            });
            const resultado = this.generarResultadoModulo(sesion.respuestasCorrectas || 0, moduloData.preguntas.length, moduloUsuario, sesion);
            await this.whatsappService.enviarMensaje(numeroUsuario, resultado);
            const totalModulos = this.getTotalModulos(sesion);
            if (moduloUsuario < totalModulos) {
                const siguienteModulo = moduloUsuario + 1;
                this.sessionService.actualizarSesionUsuario(numeroUsuario, {
                    ...sesion,
                    modulo: siguienteModulo,
                });
                setTimeout(async () => {
                    try {
                        await this.enviarVideoTutorial(numeroUsuario, siguienteModulo);
                        setTimeout(async () => {
                            try {
                                await this.iniciarFormulario(numeroUsuario);
                            }
                            catch (formError) {
                                this.logger.error(`Error iniciando formulario del módulo ${siguienteModulo} para usuario ${numeroUsuario}:`, formError);
                                await this.whatsappService.enviarMensaje(numeroUsuario, showPruebaTips
                                    ? "⚠️ Error al continuar. Escribe 'prueba' para reiniciar."
                                    : '⚠️ Error al continuar.');
                            }
                        }, 2000);
                    }
                    catch (videoError) {
                        this.logger.error(`Error enviando video del módulo ${siguienteModulo} para usuario ${numeroUsuario}:`, videoError);
                        setTimeout(async () => {
                            try {
                                await this.iniciarFormulario(numeroUsuario);
                            }
                            catch (formError) {
                                this.logger.error(`Error iniciando formulario:`, formError);
                            }
                        }, 1000);
                    }
                }, 3000);
                return null;
            }
            else {
                const mensajeFinal = this.generarMensajeFinal(sesion.resultadosModulos);
                await this.whatsappService.enviarMensaje(numeroUsuario, mensajeFinal);
                setTimeout(async () => {
                    try {
                        await this.enviarCertificadoYEncuesta(numeroUsuario, sesion.resultadosModulos || []);
                    }
                    catch (certError) {
                        this.logger.error(`Error enviando certificado:`, certError);
                        try {
                            await this.whatsappService.enviarMensaje(numeroUsuario, '🎉 ¡Felicitaciones! Has completado todos los módulos del curso. 🏆');
                        }
                        catch (e) {
                            this.logger.error('Error enviando mensaje de felicitación:', e);
                        }
                    }
                }, 2000);
                return null;
            }
        }
    }
    generarResultadoModulo(respuestasCorrectas, totalPreguntas, moduloNumero, sesion) {
        const porcentaje = (respuestasCorrectas / totalPreguntas) * 100;
        const moduloData = this.getModuloData(sesion, moduloNumero);
        const totalModulos = this.getTotalModulos(sesion);
        let mensaje = `🎉 ¡${moduloData.titulo} completado!\n\n`;
        mensaje += `📊 Resultado: ${respuestasCorrectas}/${totalPreguntas} respuestas correctas (${porcentaje.toFixed(1)}%)\n\n`;
        if (porcentaje >= 80) {
            mensaje += `🏆 ¡Excelente! Has dominado este módulo.`;
        }
        else if (porcentaje >= 60) {
            mensaje += `👍 ¡Bien hecho! Tienes una buena base en este tema.`;
        }
        else {
            mensaje += `📚 Es importante reforzar estos conceptos.`;
        }
        if (moduloNumero < totalModulos) {
            mensaje += `\n\n🎬 Continuemos con el siguiente módulo...`;
        }
        return mensaje;
    }
    generarMensajeFinal(resultadosModulos) {
        let mensaje = `🎉 ¡Felicitaciones! 🎉\n\n`;
        mensaje += `Has completado con éxito los 6 módulos del curso de Concientización en Seguridad Digital. Ahora estás mejor preparado para identificar y protegerte de amenazas como el phishing y otros riesgos en línea.\n\n`;
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
    generarResumenParcial(resultadosModulos, moduloActual, respuestasCorrectasActual, preguntaActual, sesion) {
        this.logger.debug('=== DEBUG generarResumenParcial ===');
        this.logger.debug('resultadosModulos:', resultadosModulos);
        this.logger.debug('moduloActual:', moduloActual);
        this.logger.debug('respuestasCorrectas:', respuestasCorrectasActual);
        this.logger.debug('totalPreguntas:', preguntaActual);
        let mensaje = `📊 **Resumen de tu progreso:**\n\n`;
        if (resultadosModulos && resultadosModulos.length > 0) {
            mensaje += `**Módulos completados:**\n`;
            resultadosModulos.forEach((resultado, index) => {
                mensaje += `${index + 1}. ${resultado.titulo.replace('✅ ', '')}\n`;
                mensaje += `   📈 ${resultado.respuestasCorrectas}/${resultado.totalPreguntas} (${resultado.porcentaje.toFixed(1)}%)\n\n`;
            });
        }
        else {
            mensaje += `**Módulos completados:** Ninguno\n\n`;
        }
        if (preguntaActual > 0) {
            const porcentajeActual = (respuestasCorrectasActual / preguntaActual) * 100;
            mensaje += `**Módulo actual (${moduloActual}):**\n`;
            mensaje += `📈 ${respuestasCorrectasActual}/${preguntaActual} (${porcentajeActual.toFixed(1)}%) - En progreso\n\n`;
        }
        else {
            if (moduloActual && sesion) {
                try {
                    const moduloData = this.getModuloData(sesion, moduloActual);
                    mensaje += `**Módulo actual (${moduloActual}):**\n`;
                    mensaje += `${moduloData.titulo}\n`;
                    mensaje += `📈 No has respondido preguntas aún\n\n`;
                }
                catch (error) {
                    this.logger.warn(`No se pudo obtener datos del módulo ${moduloActual}`);
                }
            }
        }
        const showPruebaTips = this.configService.get('MOSTRAR_TIP_PRUEBA', true);
        mensaje += showPruebaTips
            ? `Puedes retomar el curso en cualquier momento escribiendo 'prueba'. ¡Nos vemos pronto! 👋`
            : `Gracias por tu participación. ¡Nos vemos pronto! 👋`;
        return mensaje;
    }
    async enviarCertificadoYEncuesta(numeroUsuario, resultadosModulos) {
        const certificadoUrl = 'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/Certificado-curso-Phishing.jpg';
        await this.whatsappService.enviarImagen(numeroUsuario, certificadoUrl, '🎉 ¡Felicitaciones! Has completado el curso de Concientización en Seguridad Digital. Aquí tienes tu certificado.');
        setTimeout(async () => {
            const mensajeEncuesta = `Tu opinión es muy valiosa para nosotros. Por favor, tómate 1 minuto para responder esta breve encuesta y ayudarnos a mejorar.\n\n👉 Solo haz clic en las opciones que mejor representen tu experiencia.\n\n¡Tus respuestas son anónimas y nos ayudarán a crear mejores contenidos para todos! 🙌\n\n📝 **Encuesta de Satisfacción - Curso de Phishing**`;
            await this.whatsappService.enviarMensaje(numeroUsuario, mensajeEncuesta);
            setTimeout(() => {
                this.surveyService.iniciarEncuesta(numeroUsuario);
            }, 2000);
        }, 3000);
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = CourseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsAppService,
        session_service_1.SessionService,
        database_service_1.DatabaseService,
        survey_service_1.SurveyService,
        config_1.ConfigService,
        courses_service_1.CoursesService])
], CourseService);
//# sourceMappingURL=course.service.js.map