import { Controller, Get, Post, Body, Query, Logger } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { CourseService } from './course.service';
import { MessageRouterService } from './message-router.service';
import { InMemoryQueueService } from '../queue/in-memory-queue.service';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Controlador de WhatsApp - Webhooks y Endpoints
 * Migrado de secure-fortress-06743/index.js
 * Todas las rutas son públicas (webhooks de WhatsApp)
 */
@Public()
@Controller()
export class WhatsAppController {
  private readonly logger = new Logger(WhatsAppController.name);
  private readonly webhookVerifyToken: string;

  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly sessionService: SessionService,
    private readonly courseService: CourseService,
    private readonly messageRouterService: MessageRouterService,
    private readonly queueService: InMemoryQueueService,
    private readonly configService: ConfigService,
  ) {
    this.webhookVerifyToken = this.configService.get<string>('whatsapp.webhookVerifyToken') || '';
  }

  /**
   * GET /webhook - Verificación de webhook de Meta
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    this.logger.log('📞 Solicitud de verificación de webhook recibida');

    if (mode === 'subscribe' && token === this.webhookVerifyToken) {
      this.logger.log('✅ Webhook verificado correctamente');
      return challenge;
    } else {
      this.logger.error('❌ Error en verificación de webhook');
      return 'Error de verificación';
    }
  }

  /**
   * POST /webhook - Procesamiento de mensajes de WhatsApp
   */
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    this.logger.log('📨 Webhook POST recibido');

    try {
      // Verificar que sea un mensaje de WhatsApp
      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        if (!value?.messages) {
          return { status: 'ok' };
        }

        const message = value.messages[0];
        const numeroUsuario = message.from;

        // Verificar que el mensaje es de tipo procesable (text, interactive, button)
        if (
          message?.type === 'text' ||
          message?.type === 'interactive' ||
          message?.type === 'button'
        ) {
          this.logger.log(`📱 Mensaje ${message.type} recibido de: ${numeroUsuario}`);

          // Usar cola de procesamiento para evitar race conditions
          await this.queueService.procesarMensajeConCola(numeroUsuario, async () => {
            await this.messageRouterService.procesarMensajeUsuario(numeroUsuario, message);
          });

          // Marcar mensaje como leído
          try {
            await this.whatsappService.marcarComoLeido(message.id);
          } catch (error) {
            this.logger.error('Error marcando mensaje como leído:', error);
          }
        } else {
          this.logger.log(`📭 Mensaje tipo ${message?.type} ignorado de: ${numeroUsuario}`);
        }

        return { status: 'ok' };
      }
    } catch (error) {
      this.logger.error('Error procesando webhook:', error);
    }

    return { status: 'ok' };
  }

  /**
   * POST /iniciar-prueba - Endpoint para iniciar curso
   */
  @Post('iniciar-prueba')
  async iniciarPrueba(@Body() body: {
    numeros: string[];
    usarPlantilla?: boolean;
    courseId?: string; // ID del curso de MongoDB (opcional, usa curso por defecto si no se especifica)
  }) {
    const courseInfo = body.courseId ? `curso ID: ${body.courseId}` : 'curso por defecto';
    this.logger.log(`🚀 Iniciando ${courseInfo} para ${body.numeros.length} usuarios`);

    try {
      const usarPlantilla = body.usarPlantilla !== undefined ? body.usarPlantilla : false;
      const resultados: Array<{ numero: string; success: boolean; error?: string }> = [];

      // Procesar en lotes de 5 usuarios para evitar sobrecarga
      const batchSize = 5;
      for (let i = 0; i < body.numeros.length; i += batchSize) {
        const batch = body.numeros.slice(i, i + batchSize);

        const batchPromises = batch.map(async (numero) => {
          try {
            await this.courseService.iniciarPruebaDirecta(numero, usarPlantilla, body.courseId);
            return { numero, success: true };
          } catch (error: any) {
            this.logger.error(`Error iniciando curso para ${numero}:`, error);
            return { numero, success: false, error: error.message };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        resultados.push(...batchResults);

        // Pequeña pausa entre lotes
        if (i + batchSize < body.numeros.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const exitosos = resultados.filter(r => r.success).length;
      const fallidos = resultados.filter(r => !r.success).length;

      return {
        success: true,
        message: `Curso iniciado: ${exitosos} exitosos, ${fallidos} fallidos`,
        resultados,
      };
    } catch (error) {
      this.logger.error('Error iniciando curso:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * POST /enviar-test - Enviar template de prueba
   */
  @Post('enviar-test')
  async enviarTest(@Body() body: { numero: string }) {
    try {
      await this.whatsappService.enviarMensajePlantilla(
        body.numero,
        'test',
        'en_US',
      );
      return { success: true, message: 'Template enviado' };
    } catch (error) {
      this.logger.error('Error enviando template:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET /health - Health check
   */
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      sessions: this.sessionService.obtenerEstadisticas(),
    };
  }
}
