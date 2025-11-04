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
var WhatsAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    configService;
    logger = new common_1.Logger(WhatsAppService_1.name);
    apiToken;
    businessPhone;
    apiVersion;
    baseUrl;
    constructor(configService) {
        this.configService = configService;
        this.apiToken = this.configService.get('whatsapp.apiToken') || '';
        this.businessPhone = this.configService.get('whatsapp.businessPhone') || '';
        this.apiVersion = this.configService.get('whatsapp.apiVersion') || 'v22.0';
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.businessPhone}/messages`;
    }
    async enviarMensaje(numeroDestino, texto) {
        try {
            const response = await (0, axios_1.default)({
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
        }
        catch (error) {
            this.logger.error('Error enviando mensaje:', error.response?.data || error.message);
            throw error;
        }
    }
    async enviarVideo(numeroDestino, videoUrl, caption = '') {
        try {
            const response = await (0, axios_1.default)({
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
        }
        catch (error) {
            this.logger.error('Error enviando video:', error.response?.data || error.message);
            throw error;
        }
    }
    async enviarImagen(numeroDestino, imagenPath, caption = '') {
        try {
            await (0, axios_1.default)({
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
        }
        catch (error) {
            this.logger.error('Error enviando imagen:', error);
        }
    }
    async marcarComoLeido(messageId) {
        try {
            await (0, axios_1.default)({
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
        }
        catch (error) {
            this.logger.error('Error marcando como leído:', error);
        }
    }
    async enviarBotonesSimples(numeroDestino, texto, botones) {
        try {
            await (0, axios_1.default)({
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
        }
        catch (error) {
            this.logger.error('Error enviando botones simples:', error);
        }
    }
    async enviarBotonesOpciones(numeroDestino, texto, botones) {
        try {
            await (0, axios_1.default)({
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
        }
        catch (error) {
            this.logger.error('Error enviando botones de opciones:', error.response?.data || error.message);
            try {
                const textoFallback = texto + '\n\n💡 Responde con: A, B o C';
                await this.enviarMensaje(numeroDestino, textoFallback);
            }
            catch (fallbackError) {
                this.logger.error('Error en fallback de texto:', fallbackError);
            }
        }
    }
    async enviarPreguntaConLista(numeroDestino, texto, opciones, header = 'Pregunta', footer = '💡 Selecciona tu respuesta') {
        try {
            const rows = opciones.map((opcion, index) => {
                const letra = String.fromCharCode(65 + index);
                return {
                    id: `respuesta_${letra}`,
                    title: letra,
                    description: opcion.substring(0, 72),
                };
            });
            await (0, axios_1.default)({
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
            this.logger.log(`✅ Lista enviada con ${opciones.length} opciones para usuario ${numeroDestino}`);
        }
        catch (error) {
            this.logger.error('Error enviando pregunta con lista:', error.response?.data || error.message);
            try {
                let textoFallback = texto + '\n\n';
                opciones.forEach((opcion, index) => {
                    textoFallback += `${String.fromCharCode(65 + index)}) ${opcion}\n`;
                });
                textoFallback += '\n💡 Responde con la letra de tu opción';
                await this.enviarMensaje(numeroDestino, textoFallback);
            }
            catch (fallbackError) {
                this.logger.error('Error en fallback de texto:', fallbackError);
            }
        }
    }
    async enviarMensajePlantilla(numeroDestino, nombrePlantilla, idioma = 'es_AR', parametros = []) {
        try {
            const data = {
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
            const response = await (0, axios_1.default)({
                method: 'POST',
                url: this.baseUrl,
                headers: {
                    Authorization: `Bearer ${this.apiToken}`,
                },
                data,
            });
            this.logger.log(`📧 Template '${nombrePlantilla}' enviado a ${numeroDestino}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error enviando template '${nombrePlantilla}':`, error.response?.data || error.message);
            throw error;
        }
    }
    async enviarVideoTutorial(numeroUsuario, videoUrl, moduloActual) {
        const caption = `🎬 ¡Comencemos con el Módulo ${moduloActual}!\n\nMira este breve video para entender los conceptos clave de este módulo 📹`;
        try {
            await this.enviarVideo(numeroUsuario, videoUrl, caption);
            this.logger.log(`✅ Video del Módulo ${moduloActual} enviado a ${numeroUsuario}`);
        }
        catch (error) {
            this.logger.error(`❌ Error enviando video del Módulo ${moduloActual}, usando fallback de texto`);
            const textoFallback = `${caption}\n\n🔗 Ver video aquí: ${videoUrl}`;
            await this.enviarMensaje(numeroUsuario, textoFallback);
        }
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map