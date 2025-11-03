import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
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

  // Prefix global para API (opcional)
  // app.setGlobalPrefix('api');

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
  ║   🔗 CORS: ${corsOrigin.padEnd(42)}║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
