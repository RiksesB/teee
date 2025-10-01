import { SessionRepository } from '../../domain/repositories/SessionRepository.js';
import { UserSession } from '../../domain/entities/UserSession.js';

/**
 * Infrastructure: MongoDB Session Repository Implementation
 */
export class MongoSessionRepository extends SessionRepository {
  constructor(database) {
    super();
    this.db = database;
    this.sessions = new Map(); // Cache en memoria para sesiones activas
  }

  async save(session) {
    try {
      // Guardar en cache (memoria)
      this.sessions.set(session.phoneNumber, session);

      // Guardar en base de datos si está disponible
      if (this.db) {
        const collection = this.db.collection('active_sessions');
        await collection.replaceOne(
          { phoneNumber: session.phoneNumber },
          {
            ...session,
            updatedAt: new Date()
          },
          { upsert: true }
        );
      }

      return session;
    } catch (error) {
      console.error('Error guardando sesión:', error);
      // Mantener en cache aunque falle la BD
      this.sessions.set(session.phoneNumber, session);
      return session;
    }
  }

  async findByPhoneNumber(phoneNumber) {
    try {
      // Buscar primero en cache
      const cachedSession = this.sessions.get(phoneNumber);
      if (cachedSession) {
        return cachedSession;
      }

      // Buscar en base de datos si está disponible
      if (this.db) {
        const collection = this.db.collection('active_sessions');
        const sessionData = await collection.findOne({ phoneNumber });
        
        if (sessionData) {
          const session = new UserSession(sessionData);
          // Agregar al cache
          this.sessions.set(phoneNumber, session);
          return session;
        }
      }

      return null;
    } catch (error) {
      console.error('Error buscando sesión:', error);
      return this.sessions.get(phoneNumber) || null;
    }
  }

  async update(phoneNumber, sessionData) {
    try {
      // Actualizar cache
      this.sessions.set(phoneNumber, sessionData);

      // Actualizar en base de datos
      if (this.db) {
        const collection = this.db.collection('active_sessions');
        await collection.updateOne(
          { phoneNumber },
          {
            $set: {
              ...sessionData,
              updatedAt: new Date()
            }
          }
        );
      }

      return sessionData;
    } catch (error) {
      console.error('Error actualizando sesión:', error);
      return sessionData;
    }
  }

  async delete(phoneNumber) {
    try {
      // Eliminar del cache
      this.sessions.delete(phoneNumber);

      // Eliminar de base de datos
      if (this.db) {
        const collection = this.db.collection('active_sessions');
        await collection.deleteOne({ phoneNumber });
      }

      return true;
    } catch (error) {
      console.error('Error eliminando sesión:', error);
      return true; // Continuar aunque falle la BD
    }
  }

  async findExpiredSessions(timeoutMinutes = 30) {
    try {
      const now = new Date();
      const expiredSessions = [];

      // Verificar cache
      for (const [phoneNumber, session] of this.sessions) {
        if (session.isExpired(timeoutMinutes)) {
          expiredSessions.push(session);
        }
      }

      // Verificar base de datos si está disponible
      if (this.db) {
        const cutoffTime = new Date(now.getTime() - timeoutMinutes * 60 * 1000);
        const collection = this.db.collection('active_sessions');
        
        const dbExpiredSessions = await collection.find({
          lastActivity: { $lt: cutoffTime }
        }).toArray();

        // Agregar sesiones encontradas en BD que no estén en cache
        for (const sessionData of dbExpiredSessions) {
          if (!this.sessions.has(sessionData.phoneNumber)) {
            expiredSessions.push(new UserSession(sessionData));
          }
        }
      }

      return expiredSessions;
    } catch (error) {
      console.error('Error buscando sesiones expiradas:', error);
      return [];
    }
  }

  async cleanupExpiredSessions() {
    try {
      const expiredSessions = await this.findExpiredSessions();
      
      for (const session of expiredSessions) {
        await this.delete(session.phoneNumber);
      }

      return expiredSessions.length;
    } catch (error) {
      console.error('Error limpiando sesiones expiradas:', error);
      return 0;
    }
  }

  async findActiveSessions() {
    try {
      const activeSessions = [];

      // Obtener del cache
      for (const [phoneNumber, session] of this.sessions) {
        if (!session.isExpired()) {
          activeSessions.push(session);
        }
      }

      // Obtener de base de datos sesiones que no estén en cache
      if (this.db) {
        const collection = this.db.collection('active_sessions');
        const dbSessions = await collection.find({}).toArray();
        
        for (const sessionData of dbSessions) {
          if (!this.sessions.has(sessionData.phoneNumber)) {
            const session = new UserSession(sessionData);
            if (!session.isExpired()) {
              activeSessions.push(session);
              // Agregar al cache
              this.sessions.set(sessionData.phoneNumber, session);
            }
          }
        }
      }

      return activeSessions;
    } catch (error) {
      console.error('Error obteniendo sesiones activas:', error);
      return Array.from(this.sessions.values()).filter(session => !session.isExpired());
    }
  }

  // Métodos adicionales para gestión
  async getSessionCount() {
    try {
      const activeSessions = await this.findActiveSessions();
      return activeSessions.length;
    } catch (error) {
      console.error('Error obteniendo conteo de sesiones:', error);
      return this.sessions.size;
    }
  }

  async getSessionStatistics() {
    try {
      const activeSessions = await this.findActiveSessions();
      
      const stats = {
        total: activeSessions.length,
        byState: {},
        byModule: {},
        averageSessionTime: 0
      };

      let totalSessionTime = 0;

      for (const session of activeSessions) {
        // Estadísticas por estado
        stats.byState[session.state] = (stats.byState[session.state] || 0) + 1;
        
        // Estadísticas por módulo
        stats.byModule[session.currentModule] = (stats.byModule[session.currentModule] || 0) + 1;
        
        // Tiempo de sesión
        const sessionTime = (session.lastActivity - session.startedAt) / (1000 * 60); // minutos
        totalSessionTime += sessionTime;
      }

      stats.averageSessionTime = activeSessions.length > 0 ? totalSessionTime / activeSessions.length : 0;

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas de sesiones:', error);
      return { total: 0, byState: {}, byModule: {}, averageSessionTime: 0 };
    }
  }
}