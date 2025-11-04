declare const _default: () => {
    port: number;
    nodeEnv: string;
    whatsapp: {
        webhookVerifyToken: string;
        apiToken: string;
        businessPhone: string;
        apiVersion: string;
        baseUrl: string;
    };
    database: {
        uri: string;
    };
    redis: {
        host: string;
        port: number;
        password: string | undefined;
    };
    app: {
        mostrarTipPrueba: boolean;
        sessionTimeoutMinutes: number;
        maxConcurrentSessions: number;
    };
    cors: {
        origin: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
};
export default _default;
