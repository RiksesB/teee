export declare class InMemoryQueueService {
    private readonly logger;
    private readonly messageQueues;
    private readonly processingUsers;
    procesarMensajeConCola(numeroUsuario: string, handler: () => Promise<void>): Promise<void>;
    getQueueStats(): {
        activeUsers: number;
        totalQueued: number;
        usersWithMessages: number;
    };
    clearAllQueues(): void;
}
