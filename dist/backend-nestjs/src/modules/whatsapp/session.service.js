"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SessionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
let SessionService = SessionService_1 = class SessionService {
    logger = new common_1.Logger(SessionService_1.name);
    userSessions = new Map();
    onModuleInit() {
        setInterval(() => {
            this.cleanInactiveSessions();
        }, 30 * 60 * 1000);
        this.logger.log('✅ SessionService inicializado con limpieza automática');
    }
    obtenerSesionUsuario(numeroUsuario) {
        const sesion = this.userSessions.get(numeroUsuario);
        if (sesion) {
            this.logger.debug(`🔍 Sesión activa para ${numeroUsuario}: Módulo ${sesion.modulo}, Estado: ${sesion.estado || (sesion.enFormulario ? 'formulario' : sesion.enEncuesta ? 'encuesta' : 'desconocido')}`);
        }
        return sesion;
    }
    actualizarSesionUsuario(numeroUsuario, datosNuevos) {
        const sesionActual = this.userSessions.get(numeroUsuario) || {
            numeroUsuario,
            modulo: 1,
            iniciadoEn: new Date(),
            ultimaActividad: new Date(),
        };
        const sesionActualizada = {
            ...sesionActual,
            ...datosNuevos,
            ultimaActividad: new Date(),
        };
        this.userSessions.set(numeroUsuario, sesionActualizada);
        this.logger.log(`✅ Sesión actualizada para ${numeroUsuario}: Módulo ${sesionActualizada.modulo}`);
        return sesionActualizada;
    }
    crearSesion(numeroUsuario, modulo = 1) {
        const nuevaSesion = {
            numeroUsuario,
            modulo,
            iniciadoEn: new Date(),
            ultimaActividad: new Date(),
            enFormulario: false,
            enEncuesta: false,
            respuestasDetalladas: [],
            resultadosModulos: [],
        };
        this.userSessions.set(numeroUsuario, nuevaSesion);
        this.logger.log(`🆕 Nueva sesión creada para ${numeroUsuario}`);
        return nuevaSesion;
    }
    eliminarSesion(numeroUsuario) {
        this.userSessions.delete(numeroUsuario);
        this.logger.log(`🗑️ Sesión eliminada para ${numeroUsuario}`);
    }
    existeSesion(numeroUsuario) {
        return this.userSessions.has(numeroUsuario);
    }
    obtenerSesionesActivas() {
        return this.userSessions;
    }
    obtenerEstadisticas() {
        const total = this.userSessions.size;
        let enFormulario = 0;
        let enEncuesta = 0;
        this.userSessions.forEach((sesion) => {
            if (sesion.enFormulario)
                enFormulario++;
            if (sesion.enEncuesta)
                enEncuesta++;
        });
        return {
            total,
            enFormulario,
            enEncuesta,
            enPrueba: total - enFormulario - enEncuesta,
        };
    }
    cleanInactiveSessions() {
        const ahora = new Date();
        const tiempoInactividadMax = 60 * 60 * 1000;
        let sesionesEliminadas = 0;
        this.userSessions.forEach((sesion, numeroUsuario) => {
            const ultimaActividad = sesion.ultimaActividad || sesion.iniciadoEn;
            if (ultimaActividad && ahora.getTime() - ultimaActividad.getTime() > tiempoInactividadMax) {
                this.userSessions.delete(numeroUsuario);
                sesionesEliminadas++;
                this.logger.log(`🗑️ Sesión inactiva eliminada para ${numeroUsuario}`);
            }
        });
        if (sesionesEliminadas > 0) {
            this.logger.log(`🧹 Limpieza de sesiones: ${sesionesEliminadas} sesiones eliminadas`);
        }
    }
    limpiarTodasLasSesiones() {
        this.userSessions.clear();
        this.logger.log('🧹 Todas las sesiones limpiadas');
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = SessionService_1 = __decorate([
    (0, common_1.Injectable)()
], SessionService);
//# sourceMappingURL=session.service.js.map