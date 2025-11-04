import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';
import { SessionService } from './session.service';
import { CourseService } from './course.service';
import { SurveyService } from './survey.service';
import { MessageRouterService } from './message-router.service';
import { DatabaseModule } from '../database/database.module';
import { QueueModule } from '../queue/queue.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [ConfigModule, DatabaseModule, QueueModule, CoursesModule],
  controllers: [WhatsAppController],
  providers: [
    WhatsAppService,
    SessionService,
    CourseService,
    SurveyService,
    MessageRouterService,
  ],
  exports: [
    WhatsAppService,
    SessionService,
    CourseService,
    SurveyService,
    MessageRouterService,
  ],
})
export class WhatsAppModule {}
