import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { DatabaseService } from '../database/database.service';
import { SurveyService } from './survey.service';
import { ConfigService } from '@nestjs/config';
interface RandomizacionResult {
    opcionesRandomizadas: string[];
    mapeoRespuestas: Record<string, string>;
    mapeoRetroalimentacion: Record<string, string>;
    respuestaCorrectaNueva: string;
}
interface PreguntaCustom {
    numero: number;
    pregunta: string;
    opciones: string[];
}
export declare class CourseService {
    private readonly whatsappService;
    private readonly sessionService;
    private readonly databaseService;
    private readonly surveyService;
    private readonly configService;
    private readonly logger;
    constructor(whatsappService: WhatsAppService, sessionService: SessionService, databaseService: DatabaseService, surveyService: SurveyService, configService: ConfigService);
    randomizarOpciones(pregunta: any, quitarUnaIncorrecta?: boolean): RandomizacionResult;
    enviarPregunta(numeroUsuario: string, indicePregunta: number): Promise<void>;
    enviarPreguntaConBotonesCustom(numeroUsuario: string, indicePregunta: number, preguntaCustom: PreguntaCustom): Promise<void>;
    enviarPreguntaConListaCustom(numeroUsuario: string, indicePregunta: number, preguntaCustom: PreguntaCustom): Promise<void>;
    iniciarPruebaDirecta(numeroUsuario: string, usarPlantilla?: boolean): Promise<void>;
    private enviarVideoTutorial;
    iniciarFormulario(numeroUsuario: string): Promise<void>;
    procesarRespuestaFormulario(numeroUsuario: string, message: any): Promise<string | null>;
    generarResultadoModulo(respuestasCorrectas: number, totalPreguntas: number, moduloNumero: number): string;
    generarMensajeFinal(resultadosModulos: any[]): string;
    generarResumenParcial(resultadosModulos: any[], moduloActual: number, respuestasCorrectasActual: number, preguntaActual: number): string;
    enviarCertificadoYEncuesta(numeroUsuario: string, resultadosModulos: any[]): Promise<void>;
}
export {};
