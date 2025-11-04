"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const whatsapp_controller_1 = require("./whatsapp.controller");
const whatsapp_service_1 = require("./whatsapp.service");
const session_service_1 = require("./session.service");
const course_service_1 = require("./course.service");
const survey_service_1 = require("./survey.service");
const message_router_service_1 = require("./message-router.service");
const database_module_1 = require("../database/database.module");
const queue_module_1 = require("../queue/queue.module");
const courses_module_1 = require("../courses/courses.module");
let WhatsAppModule = class WhatsAppModule {
};
exports.WhatsAppModule = WhatsAppModule;
exports.WhatsAppModule = WhatsAppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, database_module_1.DatabaseModule, queue_module_1.QueueModule, courses_module_1.CoursesModule],
        controllers: [whatsapp_controller_1.WhatsAppController],
        providers: [
            whatsapp_service_1.WhatsAppService,
            session_service_1.SessionService,
            course_service_1.CourseService,
            survey_service_1.SurveyService,
            message_router_service_1.MessageRouterService,
        ],
        exports: [
            whatsapp_service_1.WhatsAppService,
            session_service_1.SessionService,
            course_service_1.CourseService,
            survey_service_1.SurveyService,
            message_router_service_1.MessageRouterService,
        ],
    })
], WhatsAppModule);
//# sourceMappingURL=whatsapp.module.js.map