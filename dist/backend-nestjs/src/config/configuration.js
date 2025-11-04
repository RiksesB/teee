"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    whatsapp: {
        webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN || '',
        apiToken: process.env.API_TOKEN || '',
        businessPhone: process.env.BUSINESS_PHONE || '',
        apiVersion: process.env.API_VERSION || 'v22.0',
        baseUrl: `https://graph.facebook.com/${process.env.API_VERSION || 'v22.0'}`,
    },
    database: {
        uri: process.env.DATABASE_URI || 'mongodb://localhost:27017/niblion_analytics',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
    },
    app: {
        mostrarTipPrueba: process.env.MOSTRAR_TIP_PRUEBA !== 'false',
        sessionTimeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES || '30', 10),
        maxConcurrentSessions: parseInt(process.env.MAX_CONCURRENT_SESSIONS || '100', 10),
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'change-me-in-production',
        expiresIn: process.env.JWT_EXPIRATION || '1d',
    },
});
//# sourceMappingURL=configuration.js.map