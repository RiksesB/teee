export declare const VIDEOS_MODULOS: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
};
export interface Pregunta {
    numero: number;
    pregunta: string;
    opciones: string[];
    respuesta_correcta: string;
    retroalimentacion: Record<string, string>;
}
export interface Modulo {
    titulo: string;
    preguntas: Pregunta[];
}
export declare const MODULOS: Record<number, Modulo>;
export declare const ENCUESTA_SATISFACCION: {
    numero: number;
    pregunta: string;
    opciones: string[];
}[];
