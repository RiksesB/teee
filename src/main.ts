import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Obtener ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  const corsOrigin = configService.get<string>('cors.origin') || 'http://localhost:5173';

  // Habilitar CORS
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Habilitar validación global con DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Niblion API')
    .setDescription('API REST para gestión de cursos de ciberseguridad y campañas de capacitación vía WhatsApp Business')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese su token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Autenticación', 'Endpoints de autenticación y gestión de tokens')
    .addTag('Cursos', 'Gestión de cursos de capacitación')
    .addTag('WhatsApp', 'Integración con WhatsApp Business API')
    .addTag('Usuarios', 'Gestión de usuarios y perfiles')
    .addTag('Campañas', 'Gestión de campañas de capacitación')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
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

  // Prefix global para API
  app.setGlobalPrefix('api');

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
