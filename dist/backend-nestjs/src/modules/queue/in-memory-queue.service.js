"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InMemoryQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryQueueService = void 0;
const common_1 = require("@nestjs/common");
let InMemoryQueueService = InMemoryQueueService_1 = class InMemoryQueueService {
    logger = new common_1.Logger(InMemoryQueueService_1.name);
    messageQueues = new Map();
    processingUsers = new Set();
    async procesarMensajeConCola(numeroUsuario, handler) {
        if (!this.messageQueues.has(numeroUsuario)) {
            this.messageQueues.set(numeroUsuario, []);
        }
        const queue = this.messageQueues.get(numeroUsuario);
        queue.push(handler);
        if (this.processingUsers.has(numeroUsuario)) {
            this.logger.log(`⏳ Mensaje encolado para ${numeroUsuario} (${queue.length} en cola)`);
            return;
        }
        this.processingUsers.add(numeroUsuario);
        this.logger.log(`🔄 Iniciando procesamiento de cola para ${numeroUsuario}`);
        const userQueue = this.messageQueues.get(numeroUsuario);
        while (userQueue && userQueue.length > 0) {
            const nextHandler = userQueue.shift();
            if (nextHandler) {
                try {
                    await nextHandler();
                }
                catch (error) {
                    this.logger.error(`❌ Error procesando mensaje para ${numeroUsuario}:`, error);
                }
            }
        }
        this.processingUsers.delete(numeroUsuario);
        this.messageQueues.delete(numeroUsuario);
        this.logger.log(`✅ Cola procesada completamente para ${numeroUsuario}`);
    }
    getQueueStats() {
        const totalQueued = Array.from(this.messageQueues.values()).reduce((sum, queue) => sum + queue.length, 0);
        return {
            activeUsers: this.processingUsers.size,
            totalQueued,
            usersWithMessages: this.messageQueues.size,
        };
    }
    clearAllQueues() {
        this.messageQueues.clear();
        this.processingUsers.clear();
        this.logger.log('🧹 Todas las colas limpiadas');
    }
};
exports.InMemoryQueueService = InMemoryQueueService;
exports.InMemoryQueueService = InMemoryQueueService = InMemoryQueueService_1 = __decorate([
    (0, common_1.Injectable)()
], InMemoryQueueService);
//# sourceMappingURL=in-memory-queue.service.js.map