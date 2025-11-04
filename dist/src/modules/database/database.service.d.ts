import { Model } from 'mongoose';
import { UserSession } from './schemas/user-session.schema';
import { QuizResponse } from './schemas/quiz-response.schema';
import { SurveyResponse } from './schemas/survey-response.schema';
export declare class DatabaseService {
    private userSessionModel;
    private quizResponseModel;
    private surveyResponseModel;
    private readonly logger;
    constructor(userSessionModel: Model<UserSession>, quizResponseModel: Model<QuizResponse>, surveyResponseModel: Model<SurveyResponse>);
    guardarDatosUsuario(datosUsuario: any): Promise<UserSession>;
    guardarRespuestasFormulario(numeroUsuario: string, modulo: number, respuestas: any): Promise<QuizResponse>;
    guardarRespuestasEncuesta(numeroUsuario: string, respuestasEncuesta: any[], resultadosModulos: any[]): Promise<SurveyResponse>;
    getUseSessionsByUser(numeroUsuario: string): Promise<UserSession[]>;
    getQuizResponsesByUser(numeroUsuario: string): Promise<QuizResponse[]>;
    getSurveyResponsesByUser(numeroUsuario: string): Promise<SurveyResponse[]>;
    getAllCompletedSurveys(): Promise<SurveyResponse[]>;
    getModuleStatistics(modulo: number): Promise<any[]>;
}
