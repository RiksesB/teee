import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { CourseService } from './course.service';
import { MessageRouterService } from './message-router.service';
import { InMemoryQueueService } from '../queue/in-memory-queue.service';
import { ConfigService } from '@nestjs/config';
export declare class WhatsAppController {
    private readonly whatsappService;
    private readonly sessionService;
    private readonly courseService;
    private readonly messageRouterService;
    private readonly queueService;
    private readonly configService;
    private readonly logger;
    private readonly webhookVerifyToken;
    constructor(whatsappService: WhatsAppService, sessionService: SessionService, courseService: CourseService, messageRouterService: MessageRouterService, queueService: InMemoryQueueService, configService: ConfigService);
    verifyWebhook(mode: string, token: string, challenge: string): string;
    handleWebhook(body: any): Promise<{
        status: string;
    }>;
    iniciarPrueba(body: {
        numeros: string[];
        usarPlantilla?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        resultados: {
            numero: string;
            success: boolean;
            error?: string;
        }[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        resultados?: undefined;
    }>;
    enviarTest(body: {
        numero: string;
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    healthCheck(): {
        status: string;
        timestamp: string;
        sessions: {
            total: number;
            enFormulario: number;
            enEncuesta: number;
            enPrueba: number;
        };
    };
}
