"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_session_schema_1 = require("./schemas/user-session.schema");
const quiz_response_schema_1 = require("./schemas/quiz-response.schema");
const survey_response_schema_1 = require("./schemas/survey-response.schema");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    userSessionModel;
    quizResponseModel;
    surveyResponseModel;
    logger = new common_1.Logger(DatabaseService_1.name);
    constructor(userSessionModel, quizResponseModel, surveyResponseModel) {
        this.userSessionModel = userSessionModel;
        this.quizResponseModel = quizResponseModel;
        this.surveyResponseModel = surveyResponseModel;
    }
    async guardarDatosUsuario(datosUsuario) {
        try {
            const session = new this.userSessionModel({
                ...datosUsuario,
                timestamp: new Date(),
                fecha_inicio: new Date(datosUsuario.iniciadoEn || new Date()),
            });
            const result = await session.save();
            this.logger.log(`📊 Datos guardados para usuario: ${datosUsuario.numeroUsuario}`);
            return result;
        }
        catch (error) {
            this.logger.error('Error guardando datos de usuario:', error);
            throw error;
        }
    }
    async guardarRespuestasFormulario(numeroUsuario, modulo, respuestas) {
        try {
            const response = new this.quizResponseModel({
                numeroUsuario,
                modulo,
                respuestasDetalladas: respuestas.respuestasDetalladas,
                resultadoModulo: respuestas.resultadoModulo,
                timestamp: new Date(),
            });
            const result = await response.save();
            this.logger.log(`📊 Respuestas guardadas - Usuario: ${numeroUsuario}, Módulo: ${modulo}`);
            return result;
        }
        catch (error) {
            this.logger.error('Error guardando respuestas:', error);
            throw error;
        }
    }
    async guardarRespuestasEncuesta(numeroUsuario, respuestasEncuesta, resultadosModulos) {
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
        }
        catch (error) {
            this.logger.error('Error guardando encuesta:', error);
            throw error;
        }
    }
    async getUseSessionsByUser(numeroUsuario) {
        return this.userSessionModel.find({ numeroUsuario }).exec();
    }
    async getQuizResponsesByUser(numeroUsuario) {
        return this.quizResponseModel.find({ numeroUsuario }).exec();
    }
    async getSurveyResponsesByUser(numeroUsuario) {
        return this.surveyResponseModel.find({ numeroUsuario }).exec();
    }
    async getAllCompletedSurveys() {
        return this.surveyResponseModel.find().sort({ fecha_completado: -1 }).exec();
    }
    async getModuleStatistics(modulo) {
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
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_session_schema_1.UserSession.name)),
    __param(1, (0, mongoose_1.InjectModel)(quiz_response_schema_1.QuizResponse.name)),
    __param(2, (0, mongoose_1.InjectModel)(survey_response_schema_1.SurveyResponse.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DatabaseService);
//# sourceMappingURL=database.service.js.map