/**
 * Interface: SessionRepository
 * Define los métodos para gestionar sesiones de usuario
 */
export class SessionRepository {
  async save(session) {
    throw new Error('Method not implemented');
  }

  async findByPhoneNumber(phoneNumber) {
    throw new Error('Method not implemented');
  }

  async update(phoneNumber, sessionData) {
    throw new Error('Method not implemented');
  }

  async delete(phoneNumber) {
    throw new Error('Method not implemented');
  }

  async findExpiredSessions(timeoutMinutes = 30) {
    throw new Error('Method not implemented');
  }

  async cleanupExpiredSessions() {
    throw new Error('Method not implemented');
  }

  async findActiveSessions() {
    throw new Error('Method not implemented');
  }
}