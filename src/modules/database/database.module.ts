import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSession, UserSessionSchema } from './schemas/user-session.schema';
import { QuizResponse, QuizResponseSchema } from './schemas/quiz-response.schema';
import { SurveyResponse, SurveyResponseSchema } from './schemas/survey-response.schema';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
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
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: UserSession.name, schema: UserSessionSchema },
      { name: QuizResponse.name, schema: QuizResponseSchema },
      { name: SurveyResponse.name, schema: SurveyResponseSchema },
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, MongooseModule],
})
export class DatabaseModule {}
