"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port') || 3000;
    const corsOrigin = configService.get('cors.origin') || 'http://localhost:5173';
    app.enableCors({
        origin: corsOrigin,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Niblion API')
        .setDescription('API REST para gestión de cursos de ciberseguridad y campañas de capacitación vía WhatsApp Business')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese su token JWT',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Autenticación', 'Endpoints de autenticación y gestión de tokens')
        .addTag('Cursos', 'Gestión de cursos de capacitación')
        .addTag('WhatsApp', 'Integración con WhatsApp Business API')
        .addTag('Usuarios', 'Gestión de usuarios y perfiles')
        .addTag('Campañas', 'Gestión de campañas de capacitación')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Niblion API Documentation',
        customfavIcon: 'https://nestjs.com/img/logo-small.svg',
        customCss: `
      .topbar-wrapper img { content:url('https://nestjs.com/img/logo-small.svg'); width:120px; height:auto; }
      .swagger-ui .topbar { background-color: #1a202c; }
    `,
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
    });
    await app.listen(port);
    logger.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🚀 Niblion Backend - NestJS 11                         ║
  ║                                                           ║
  ║   📱 WhatsApp Business API Ready                         ║
  ║   📊 MongoDB Connected                                    ║
  ║   🔄 In-Memory Queue Active                              ║
  ║                                                           ║
  ║   🌐 Server: http://localhost:${port.toString().padEnd(27)}║
  ║   📚 Swagger: http://localhost:${port}/api/docs${' '.repeat(18)}║
  ║   🔗 CORS: ${corsOrigin.padEnd(42)}║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map