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
exports.SurveyResponseSchema = exports.SurveyResponse = exports.ModuleSummary = exports.SurveyAnswer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class SurveyAnswer {
    numero;
    pregunta;
    respuesta;
}
exports.SurveyAnswer = SurveyAnswer;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SurveyAnswer.prototype, "numero", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SurveyAnswer.prototype, "pregunta", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SurveyAnswer.prototype, "respuesta", void 0);
class ModuleSummary {
    modulo;
    preguntasCorrectas;
    preguntasTotales;
    porcentaje;
}
exports.ModuleSummary = ModuleSummary;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ModuleSummary.prototype, "modulo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ModuleSummary.prototype, "preguntasCorrectas", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ModuleSummary.prototype, "preguntasTotales", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ModuleSummary.prototype, "porcentaje", void 0);
let SurveyResponse = class SurveyResponse extends mongoose_2.Document {
    numeroUsuario;
    respuestasEncuesta;
    resultadosModulos;
    timestamp;
    fecha_completado;
};
exports.SurveyResponse = SurveyResponse;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], SurveyResponse.prototype, "numeroUsuario", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], SurveyResponse.prototype, "respuestasEncuesta", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object] }),
    __metadata("design:type", Array)
], SurveyResponse.prototype, "resultadosModulos", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], SurveyResponse.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], SurveyResponse.prototype, "fecha_completado", void 0);
exports.SurveyResponse = SurveyResponse = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SurveyResponse);
exports.SurveyResponseSchema = mongoose_1.SchemaFactory.createForClass(SurveyResponse);
//# sourceMappingURL=survey-response.schema.js.map