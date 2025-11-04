"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const user_session_schema_1 = require("./schemas/user-session.schema");
const quiz_response_schema_1 = require("./schemas/quiz-response.schema");
const survey_response_schema_1 = require("./schemas/survey-response.schema");
const database_service_1 = require("./database.service");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('database.uri'),
                    connectionFactory: (connection) => {
                        connection.on('connected', () => {
                            console.log('✅ Conectado a MongoDB exitosamente');
                        });
                        connection.on('error', (error) => {
                            console.error('❌ Error conectando a MongoDB:', error);
                        });
                        return connection;
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: user_session_schema_1.UserSession.name, schema: user_session_schema_1.UserSessionSchema },
                { name: quiz_response_schema_1.QuizResponse.name, schema: quiz_response_schema_1.QuizResponseSchema },
                { name: survey_response_schema_1.SurveyResponse.name, schema: survey_response_schema_1.SurveyResponseSchema },
            ]),
        ],
        providers: [database_service_1.DatabaseService],
        exports: [database_service_1.DatabaseService, mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map