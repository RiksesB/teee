import { OnModuleInit } from '@nestjs/common';
export interface UserSession {
    numeroUsuario: string;
    modulo: number;
    estado?: string;
    enFormulario?: boolean;
    enEncuesta?: boolean;
    iniciadoEn: Date;
    ultimaActividad: Date;
    respuestasDetalladas?: any[];
    resultadosModulos?: any[];
    currentQuestionIndex?: number;
    respuestasEncuesta?: any[];
    preguntaActual?: number;
    respuestasCorrectas?: number;
    preguntaEncuestaActual?: number;
    mapeosPreguntas?: Record<number, {
        mapeoRespuestas: Record<string, string>;
        mapeoRetroalimentacion: Record<string, string>;
        respuestaCorrectaNueva: string;
    }>;
}
export declare class SessionService implements OnModuleInit {
    private readonly logger;
    private readonly userSessions;
    onModuleInit(): void;
    obtenerSesionUsuario(numeroUsuario: string): UserSession | undefined;
    actualizarSesionUsuario(numeroUsuario: string, datosNuevos: Partial<UserSession>): UserSession;
    crearSesion(numeroUsuario: string, modulo?: number): UserSession;
    eliminarSesion(numeroUsuario: string): void;
    existeSesion(numeroUsuario: string): boolean;
    obtenerSesionesActivas(): Map<string, UserSession>;
    obtenerEstadisticas(): {
        total: number;
        enFormulario: number;
        enEncuesta: number;
        enPrueba: number;
    };
    private cleanInactiveSessions;
    limpiarTodasLasSesiones(): void;
}
