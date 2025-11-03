import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

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

/**
 * Servicio para manejar sesiones de usuario en memoria
 * Replica la lógica de userSessions Map de secure-fortress
 */
@Injectable()
export class SessionService implements OnModuleInit {
  private readonly logger = new Logger(SessionService.name);

  // Sistema de estado para rastrear el progreso de cada usuario
  private readonly userSessions = new Map<string, UserSession>();

  onModuleInit() {
    // Limpieza automática de sesiones inactivas (cada 30 minutos)
    setInterval(() => {
      this.cleanInactiveSessions();
    }, 30 * 60 * 1000); // 30 minutos

    this.logger.log('✅ SessionService inicializado con limpieza automática');
  }

  /**
   * Obtener sesión de usuario con validación
   */
  obtenerSesionUsuario(numeroUsuario: string): UserSession | undefined {
    const sesion = this.userSessions.get(numeroUsuario);
    if (sesion) {
      this.logger.debug(
        `🔍 Sesión activa para ${numeroUsuario}: Módulo ${sesion.modulo}, Estado: ${sesion.estado || (sesion.enFormulario ? 'formulario' : sesion.enEncuesta ? 'encuesta' : 'desconocido')}`,
      );
    }
    return sesion;
  }

  /**
   * Actualizar sesión de usuario
   */
  actualizarSesionUsuario(
    numeroUsuario: string,
    datosNuevos: Partial<UserSession>,
  ): UserSession {
    const sesionActual = this.userSessions.get(numeroUsuario) || {
      numeroUsuario,
      modulo: 1,
      iniciadoEn: new Date(),
      ultimaActividad: new Date(),
    };

    const sesionActualizada: UserSession = {
      ...sesionActual,
      ...datosNuevos,
      ultimaActividad: new Date(), // Actualizar timestamp de actividad
    };

    this.userSessions.set(numeroUsuario, sesionActualizada);
    this.logger.log(
      `✅ Sesión actualizada para ${numeroUsuario}: Módulo ${sesionActualizada.modulo}`,
    );
    return sesionActualizada;
  }

  /**
   * Crear nueva sesión
   */
  crearSesion(numeroUsuario: string, modulo: number = 1): UserSession {
    const nuevaSesion: UserSession = {
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

  /**
   * Eliminar sesión
   */
  eliminarSesion(numeroUsuario: string): void {
    this.userSessions.delete(numeroUsuario);
    this.logger.log(`🗑️ Sesión eliminada para ${numeroUsuario}`);
  }

  /**
   * Verificar si existe una sesión
   */
  existeSesion(numeroUsuario: string): boolean {
    return this.userSessions.has(numeroUsuario);
  }

  /**
   * Obtener todas las sesiones activas
   */
  obtenerSesionesActivas(): Map<string, UserSession> {
    return this.userSessions;
  }

  /**
   * Obtener estadísticas de sesiones
   */
  obtenerEstadisticas() {
    const total = this.userSessions.size;
    let enFormulario = 0;
    let enEncuesta = 0;

    this.userSessions.forEach((sesion) => {
      if (sesion.enFormulario) enFormulario++;
      if (sesion.enEncuesta) enEncuesta++;
    });

    return {
      total,
      enFormulario,
      enEncuesta,
      enPrueba: total - enFormulario - enEncuesta,
    };
  }

  /**
   * Limpieza automática de sesiones inactivas
   */
  private cleanInactiveSessions(): void {
    const ahora = new Date();
    const tiempoInactividadMax = 60 * 60 * 1000; // 1 hora
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
      this.logger.log(
        `🧹 Limpieza de sesiones: ${sesionesEliminadas} sesiones eliminadas`,
      );
    }
  }

  /**
   * Limpiar todas las sesiones (útil para testing)
   */
  limpiarTodasLasSesiones(): void {
    this.userSessions.clear();
    this.logger.log('🧹 Todas las sesiones limpiadas');
  }
}
