import { ConfigService } from '@nestjs/config';
export declare class WhatsAppService {
    private configService;
    private readonly logger;
    private readonly apiToken;
    private readonly businessPhone;
    private readonly apiVersion;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    enviarMensaje(numeroDestino: string, texto: string): Promise<any>;
    enviarVideo(numeroDestino: string, videoUrl: string, caption?: string): Promise<any>;
    enviarImagen(numeroDestino: string, imagenPath: string, caption?: string): Promise<void>;
    marcarComoLeido(messageId: string): Promise<void>;
    enviarBotonesSimples(numeroDestino: string, texto: string, botones: any[]): Promise<void>;
    enviarBotonesOpciones(numeroDestino: string, texto: string, botones: any[]): Promise<void>;
    enviarPreguntaConLista(numeroDestino: string, texto: string, opciones: string[], header?: string, footer?: string): Promise<void>;
    enviarMensajePlantilla(numeroDestino: string, nombrePlantilla: string, idioma?: string, parametros?: string[]): Promise<any>;
    enviarVideoTutorial(numeroUsuario: string, videoUrl: string, moduloActual: number): Promise<void>;
}
