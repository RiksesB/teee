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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WhatsAppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppController = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_service_1 = require("./whatsapp.service");
const session_service_1 = require("./session.service");
const course_service_1 = require("./course.service");
const message_router_service_1 = require("./message-router.service");
const in_memory_queue_service_1 = require("../queue/in-memory-queue.service");
const config_1 = require("@nestjs/config");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let WhatsAppController = WhatsAppController_1 = class WhatsAppController {
    whatsappService;
    sessionService;
    courseService;
    messageRouterService;
    queueService;
    configService;
    logger = new common_1.Logger(WhatsAppController_1.name);
    webhookVerifyToken;
    constructor(whatsappService, sessionService, courseService, messageRouterService, queueService, configService) {
        this.whatsappService = whatsappService;
        this.sessionService = sessionService;
        this.courseService = courseService;
        this.messageRouterService = messageRouterService;
        this.queueService = queueService;
        this.configService = configService;
        this.webhookVerifyToken = this.configService.get('whatsapp.webhookVerifyToken') || '';
    }
    verifyWebhook(mode, token, challenge) {
        this.logger.log('📞 Solicitud de verificación de webhook recibida');
        if (mode === 'subscribe' && token === this.webhookVerifyToken) {
            this.logger.log('✅ Webhook verificado correctamente');
            return challenge;
        }
        else {
            this.logger.error('❌ Error en verificación de webhook');
            return 'Error de verificación';
        }
    }
    async handleWebhook(body) {
        this.logger.log('📨 Webhook POST recibido');
        try {
            if (body.object === 'whatsapp_business_account') {
                const entry = body.entry?.[0];
                const changes = entry?.changes?.[0];
                const value = changes?.value;
                if (!value?.messages) {
                    return { status: 'ok' };
                }
                const message = value.messages[0];
                const numeroUsuario = message.from;
                if (message?.type === 'text' ||
                    message?.type === 'interactive' ||
                    message?.type === 'button') {
                    this.logger.log(`📱 Mensaje ${message.type} recibido de: ${numeroUsuario}`);
                    await this.queueService.procesarMensajeConCola(numeroUsuario, async () => {
                        await this.messageRouterService.procesarMensajeUsuario(numeroUsuario, message);
                    });
                    try {
                        await this.whatsappService.marcarComoLeido(message.id);
                    }
                    catch (error) {
                        this.logger.error('Error marcando mensaje como leído:', error);
                    }
                }
                else {
                    this.logger.log(`📭 Mensaje tipo ${message?.type} ignorado de: ${numeroUsuario}`);
                }
                return { status: 'ok' };
            }
        }
        catch (error) {
            this.logger.error('Error procesando webhook:', error);
        }
        return { status: 'ok' };
    }
    async iniciarPrueba(body) {
        const courseInfo = body.courseId ? `curso ID: ${body.courseId}` : 'curso por defecto';
        this.logger.log(`🚀 Iniciando ${courseInfo} para ${body.numeros.length} usuarios`);
        try {
            const usarPlantilla = body.usarPlantilla !== undefined ? body.usarPlantilla : false;
            const resultados = [];
            const batchSize = 5;
            for (let i = 0; i < body.numeros.length; i += batchSize) {
                const batch = body.numeros.slice(i, i + batchSize);
                const batchPromises = batch.map(async (numero) => {
                    try {
                        await this.courseService.iniciarPruebaDirecta(numero, usarPlantilla, body.courseId);
                        return { numero, success: true };
                    }
                    catch (error) {
                        this.logger.error(`Error iniciando curso para ${numero}:`, error);
                        return { numero, success: false, error: error.message };
                    }
                });
                const batchResults = await Promise.all(batchPromises);
                resultados.push(...batchResults);
                if (i + batchSize < body.numeros.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            const exitosos = resultados.filter(r => r.success).length;
            const fallidos = resultados.filter(r => !r.success).length;
            return {
                success: true,
                message: `Curso iniciado: ${exitosos} exitosos, ${fallidos} fallidos`,
                resultados,
            };
        }
        catch (error) {
            this.logger.error('Error iniciando curso:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async enviarTest(body) {
        try {
            await this.whatsappService.enviarMensajePlantilla(body.numero, 'test', 'en_US');
            return { success: true, message: 'Template enviado' };
        }
        catch (error) {
            this.logger.error('Error enviando template:', error);
            return { success: false, error: error.message };
        }
    }
    healthCheck() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            sessions: this.sessionService.obtenerEstadisticas(),
        };
    }
};
exports.WhatsAppController = WhatsAppController;
__decorate([
    (0, common_1.Get)('webhook'),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.verify_token')),
    __param(2, (0, common_1.Query)('hub.challenge')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WhatsAppController.prototype, "verifyWebhook", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)('iniciar-prueba'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "iniciarPrueba", null);
__decorate([
    (0, common_1.Post)('enviar-test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "enviarTest", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WhatsAppController.prototype, "healthCheck", null);
exports.WhatsAppController = WhatsAppController = WhatsAppController_1 = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsAppService,
        session_service_1.SessionService,
        course_service_1.CourseService,
        message_router_service_1.MessageRouterService,
        in_memory_queue_service_1.InMemoryQueueService,
        config_1.ConfigService])
], WhatsAppController);
//# sourceMappingURL=whatsapp.controller.js.map