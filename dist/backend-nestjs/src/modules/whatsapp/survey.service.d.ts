import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { DatabaseService } from '../database/database.service';
export declare class SurveyService {
    private readonly whatsappService;
    private readonly sessionService;
    private readonly databaseService;
    private readonly logger;
    constructor(whatsappService: WhatsAppService, sessionService: SessionService, databaseService: DatabaseService);
    iniciarEncuesta(numeroUsuario: string): Promise<void>;
    enviarPreguntaEncuesta(numeroUsuario: string, indicePregunta: number): Promise<void>;
    procesarRespuestaEncuesta(numeroUsuario: string, message: any): Promise<string | null>;
}
