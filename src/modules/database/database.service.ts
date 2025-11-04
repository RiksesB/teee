import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSession } from './schemas/user-session.schema';
import { QuizResponse } from './schemas/quiz-response.schema';
import { SurveyResponse } from './schemas/survey-response.schema';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectModel(UserSession.name)
    private userSessionModel: Model<UserSession>,
    @InjectModel(QuizResponse.name)
    private quizResponseModel: Model<QuizResponse>,
    @InjectModel(SurveyResponse.name)
    private surveyResponseModel: Model<SurveyResponse>,
  ) {}

  async guardarDatosUsuario(datosUsuario: any): Promise<UserSession> {
    try {
      const session = new this.userSessionModel({
        ...datosUsuario,
        timestamp: new Date(),
        fecha_inicio: new Date(datosUsuario.iniciadoEn || new Date()),
      });
      const result = await session.save();
      this.logger.log(`📊 Datos guardados para usuario: ${datosUsuario.numeroUsuario}`);
      return result;
    } catch (error) {
      this.logger.error('Error guardando datos de usuario:', error);
      throw error;
    }
  }

  async guardarRespuestasFormulario(
    numeroUsuario: string,
    modulo: number,
    respuestas: any,
  ): Promise<QuizResponse> {
    try {
      const response = new this.quizResponseModel({
        numeroUsuario,
        modulo,
        respuestasDetalladas: respuestas.respuestasDetalladas,
        resultadoModulo: respuestas.resultadoModulo,
        timestamp: new Date(),
      });
      const result = await response.save();
      this.logger.log(
        `📊 Respuestas guardadas - Usuario: ${numeroUsuario}, Módulo: ${modulo}`,
      );
      return result;
    } catch (error) {
      this.logger.error('Error guardando respuestas:', error);
      throw error;
    }
  }

  async guardarRespuestasEncuesta(
    numeroUsuario: string,
    respuestasEncuesta: any[],
    resultadosModulos: any[],
  ): Promise<SurveyResponse> {
    try {
      const survey = new this.surveyResponseModel({
        numeroUsuario,
        respuestasEncuesta,
        resultadosModulos,
        timestamp: new Date(),
        fecha_completado: new Date(),
      });
      const result = await survey.save();
      this.logger.log(`📊 Encuesta guardada para usuario: ${numeroUsuario}`);
      return result;
    } catch (error) {
      this.logger.error('Error guardando encuesta:', error);
      throw error;
    }
  }

  // Analytics queries
  async getUseSessionsByUser(numeroUsuario: string): Promise<UserSession[]> {
    return this.userSessionModel.find({ numeroUsuario }).exec();
  }

  async getQuizResponsesByUser(numeroUsuario: string): Promise<QuizResponse[]> {
    return this.quizResponseModel.find({ numeroUsuario }).exec();
  }

  async getSurveyResponsesByUser(numeroUsuario: string): Promise<SurveyResponse[]> {
    return this.surveyResponseModel.find({ numeroUsuario }).exec();
  }

  async getAllCompletedSurveys(): Promise<SurveyResponse[]> {
    return this.surveyResponseModel.find().sort({ fecha_completado: -1 }).exec();
  }

  async getModuleStatistics(modulo: number) {
    return this.quizResponseModel.aggregate([
      { $match: { modulo } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$resultadoModulo.porcentaje' },
          totalAttempts: { $sum: 1 },
          passedUsers: {
            $sum: {
              $cond: [{ $gte: ['$resultadoModulo.porcentaje', 70] }, 1, 0],
            },
          },
        },
      },
    ]);
  }
}
