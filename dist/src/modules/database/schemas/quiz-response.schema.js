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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizResponseSchema = exports.QuizResponse = exports.ModuleResult = exports.QuestionResponse = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class QuestionResponse {
    numero;
    pregunta;
    respuestaUsuario;
    respuestaCorrecta;
    esCorrecta;
    timestamp;
}
exports.QuestionResponse = QuestionResponse;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], QuestionResponse.prototype, "numero", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], QuestionResponse.prototype, "pregunta", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], QuestionResponse.prototype, "respuestaUsuario", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], QuestionResponse.prototype, "respuestaCorrecta", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], QuestionResponse.prototype, "esCorrecta", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], QuestionResponse.prototype, "timestamp", void 0);
class ModuleResult {
    modulo;
    preguntasCorrectas;
    preguntasTotales;
    porcentaje;
}
exports.ModuleResult = ModuleResult;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ModuleResult.prototype, "modulo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ModuleResult.prototype, "preguntasCorrectas", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ModuleResult.prototype, "preguntasTotales", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ModuleResult.prototype, "porcentaje", void 0);
let QuizResponse = class QuizResponse extends mongoose_2.Document {
    numeroUsuario;
    modulo;
    respuestasDetalladas;
    resultadoModulo;
    timestamp;
};
exports.QuizResponse = QuizResponse;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], QuizResponse.prototype, "numeroUsuario", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], QuizResponse.prototype, "modulo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], QuizResponse.prototype, "respuestasDetalladas", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", ModuleResult)
], QuizResponse.prototype, "resultadoModulo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], QuizResponse.prototype, "timestamp", void 0);
exports.QuizResponse = QuizResponse = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], QuizResponse);
exports.QuizResponseSchema = mongoose_1.SchemaFactory.createForClass(QuizResponse);
//# sourceMappingURL=quiz-response.schema.js.map