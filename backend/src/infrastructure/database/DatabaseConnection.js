import { MongoClient } from 'mongodb';

/**
 * Infrastructure: Database Connection
 * Maneja la conexión a MongoDB
 */
export class DatabaseConnection {
  constructor(connectionString, databaseName = 'niblion_analytics') {
    this.connectionString = connectionString;
    this.databaseName = databaseName;
    this.client = null;
    this.db = null;
  }

  async connect() {
    if (!this.connectionString) {
      console.warn('⚠️ DATABASE_URI no configurada. Funcionando sin base de datos.');
      return null;
    }

    try {
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      this.db = this.client.db(this.databaseName);
      console.log('✅ Conectado a MongoDB exitosamente');
      return this.db;
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error);
      this.db = null;
      this.client = null;
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      try {
        await this.client.close();
        console.log('✅ Conexión de MongoDB cerrada');
      } catch (error) {
        console.error('❌ Error cerrando conexión de MongoDB:', error);
      } finally {
        this.client = null;
        this.db = null;
      }
    }
  }

  getDatabase() {
    return this.db;
  }

  isConnected() {
    return this.db !== null;
  }

  async ensureIndexes() {
    if (!this.db) return;

    try {
      // Índices para user_sessions
      await this.db.collection('user_sessions').createIndex({ phoneNumber: 1 });
      await this.db.collection('user_sessions').createIndex({ timestamp: 1 });

      // Índices para quiz_responses
      await this.db.collection('quiz_responses').createIndex({ phoneNumber: 1 });
      await this.db.collection('quiz_responses').createIndex({ moduleId: 1 });
      await this.db.collection('quiz_responses').createIndex({ timestamp: 1 });

      // Índices para survey_responses
      await this.db.collection('survey_responses').createIndex({ phoneNumber: 1 });
      await this.db.collection('survey_responses').createIndex({ timestamp: 1 });

      console.log('✅ Índices de MongoDB creados exitosamente');
    } catch (error) {
      console.error('❌ Error creando índices:', error);
    }
  }

  // Método para configurar manejo de señales de cierre
  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      console.log(`\n🛑 Cerrando servidor (${signal})...`);
      await this.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }
}