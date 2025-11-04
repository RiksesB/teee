import { Injectable, Logger } from '@nestjs/common';

/**
 * Sistema de cola de mensajes en memoria (sin Redis)
 * Replica la lógica de secure-fortress-06743/index.js para evitar race conditions
 * Cada usuario tiene su propia cola y se procesan secuencialmente
 */
@Injectable()
export class InMemoryQueueService {
  private readonly logger = new Logger(InMemoryQueueService.name);

  // Cola de mensajes por usuario
  private readonly messageQueues = new Map<string, Array<() => Promise<void>>>();

  // Usuarios actualmente en procesamiento
  private readonly processingUsers = new Set<string>();

  /**
   * Procesar mensaje con cola (evita race conditions)
   * Garantiza procesamiento secuencial de mensajes por usuario
   */
  async procesarMensajeConCola(
    numeroUsuario: string,
    handler: () => Promise<void>,
  ): Promise<void> {
    // Agregar handler a la cola del usuario
    if (!this.messageQueues.has(numeroUsuario)) {
      this.messageQueues.set(numeroUsuario, []);
    }
    const queue = this.messageQueues.get(numeroUsuario)!;
    queue.push(handler);

    // Si ya se está procesando este usuario, salir (se ejecutará después)
    if (this.processingUsers.has(numeroUsuario)) {
      this.logger.log(
        `⏳ Mensaje encolado para ${numeroUsuario} (${queue.length} en cola)`,
      );
      return;
    }

    // Marcar usuario como en procesamiento
    this.processingUsers.add(numeroUsuario);
    this.logger.log(`🔄 Iniciando procesamiento de cola para ${numeroUsuario}`);

    // Procesar todos los mensajes en cola secuencialmente
    const userQueue = this.messageQueues.get(numeroUsuario);
    while (userQueue && userQueue.length > 0) {
      const nextHandler = userQueue.shift();
      if (nextHandler) {
        try {
          await nextHandler();
        } catch (error) {
          this.logger.error(
            `❌ Error procesando mensaje para ${numeroUsuario}:`,
            error,
          );
        }
      }
    }

    // Limpiar estado
    this.processingUsers.delete(numeroUsuario);
    this.messageQueues.delete(numeroUsuario);
    this.logger.log(`✅ Cola procesada completamente para ${numeroUsuario}`);
  }

  /**
   * Obtener estadísticas de las colas
   */
  getQueueStats() {
    const totalQueued = Array.from(this.messageQueues.values()).reduce(
      (sum, queue) => sum + queue.length,
      0,
    );

    return {
      activeUsers: this.processingUsers.size,
      totalQueued,
      usersWithMessages: this.messageQueues.size,
    };
  }

  /**
   * Limpiar todas las colas (útil para testing)
   */
  clearAllQueues() {
    this.messageQueues.clear();
    this.processingUsers.clear();
    this.logger.log('🧹 Todas las colas limpiadas');
  }
}
