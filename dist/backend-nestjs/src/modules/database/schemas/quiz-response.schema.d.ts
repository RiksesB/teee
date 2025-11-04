import { Document } from 'mongoose';
export declare class QuestionResponse {
    numero: number;
    pregunta: string;
    respuestaUsuario: string;
    respuestaCorrecta: string;
    esCorrecta: boolean;
    timestamp: Date;
}
export declare class ModuleResult {
    modulo: number;
    preguntasCorrectas: number;
    preguntasTotales: number;
    porcentaje: number;
}
export declare class QuizResponse extends Document {
    numeroUsuario: string;
    modulo: number;
    respuestasDetalladas: QuestionResponse[];
    resultadoModulo: ModuleResult;
    timestamp: Date;
}
export declare const QuizResponseSchema: import("mongoose").Schema<QuizResponse, import("mongoose").Model<QuizResponse, any, any, any, Document<unknown, any, QuizResponse, any, {}> & QuizResponse & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, QuizResponse, Document<unknown, {}, import("mongoose").FlatRecord<QuizResponse>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<QuizResponse> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
