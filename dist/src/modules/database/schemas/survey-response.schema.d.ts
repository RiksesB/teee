import { Document } from 'mongoose';
export declare class SurveyAnswer {
    numero: number;
    pregunta: string;
    respuesta: string;
}
export declare class ModuleSummary {
    modulo: number;
    preguntasCorrectas: number;
    preguntasTotales: number;
    porcentaje: number;
}
export declare class SurveyResponse extends Document {
    numeroUsuario: string;
    respuestasEncuesta: SurveyAnswer[];
    resultadosModulos: ModuleSummary[];
    timestamp: Date;
    fecha_completado: Date;
}
export declare const SurveyResponseSchema: import("mongoose").Schema<SurveyResponse, import("mongoose").Model<SurveyResponse, any, any, any, Document<unknown, any, SurveyResponse, any, {}> & SurveyResponse & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SurveyResponse, Document<unknown, {}, import("mongoose").FlatRecord<SurveyResponse>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SurveyResponse> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
