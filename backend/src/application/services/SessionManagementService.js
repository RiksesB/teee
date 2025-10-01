/**
 * Service: Session Management Service
 * Gestiona las sesiones de usuario y su ciclo de vida
 */
export class SessionManagementService {
  constructor(sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async createSession(phoneNumber, initialData = {}) {
    const session = new (await import('../../domain/entities/UserSession.js')).UserSession({
      phoneNumber,
      ...initialData
    });

    await this.sessionRepository.save(session);
    return session;
  }

  async getActiveSession(phoneNumber) {
    const session = await this.sessionRepository.findByPhoneNumber(phoneNumber);
    
    if (!session) {
      return null;
    }

    // Verificar si la sesión ha expirado
    if (session.isExpired()) {
      await this.sessionRepository.delete(phoneNumber);
      return null;
    }

    return session;
  }

  async updateSession(phoneNumber, updateData) {
    const session = await this.getActiveSession(phoneNumber);
    if (!session) {
      throw new Error('Sesión no encontrada o expirada');
    }

    Object.assign(session, updateData);
    session.updateActivity();
    
    await this.sessionRepository.update(phoneNumber, session);
    return session;
  }

  async endSession(phoneNumber) {
    await this.sessionRepository.delete(phoneNumber);
  }

  async cleanupExpiredSessions() {
    const expiredSessions = await this.sessionRepository.findExpiredSessions();
    
    for (const session of expiredSessions) {
      await this.sessionRepository.delete(session.phoneNumber);
    }

    return expiredSessions.length;
  }

  async getSessionProgress(phoneNumber) {
    const session = await this.getActiveSession(phoneNumber);
    if (!session) {
      return null;
    }

    return session.generateProgressSummary();
  }

  async getAllActiveSessions() {
    return await this.sessionRepository.findActiveSessions();
  }

  async resetSession(phoneNumber) {
    const session = await this.getActiveSession(phoneNumber);
    if (session) {
      session.reset();
      await this.sessionRepository.update(phoneNumber, session);
    }
    return session;
  }

  // Método para programar limpieza automática de sesiones
  startAutomaticCleanup(intervalMinutes = 60) {
    setInterval(async () => {
      try {
        const cleanedCount = await this.cleanupExpiredSessions();
        if (cleanedCount > 0) {
          console.log(`🧹 Limpieza automática: ${cleanedCount} sesiones expiradas eliminadas`);
        }
      } catch (error) {
        console.error('Error en limpieza automática de sesiones:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }
}