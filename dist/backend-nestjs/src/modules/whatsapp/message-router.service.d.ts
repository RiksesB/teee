import { ConfigService } from '@nestjs/config';
import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { CourseService } from './course.service';
import { SurveyService } from './survey.service';
export declare class MessageRouterService {
    private readonly configService;
    private readonly whatsappService;
    private readonly sessionService;
    private readonly courseService;
    private readonly surveyService;
    private readonly logger;
    private readonly showPruebaTips;
    constructor(configService: ConfigService, whatsappService: WhatsAppService, sessionService: SessionService, courseService: CourseService, surveyService: SurveyService);
    procesarMensajeUsuario(numeroUsuario: string, message: any): Promise<void>;
}
