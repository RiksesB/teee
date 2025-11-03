import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class QuestionResponse {
  @Prop()
  numero: number;

  @Prop()
  pregunta: string;

  @Prop()
  respuestaUsuario: string;

  @Prop()
  respuestaCorrecta: string;

  @Prop()
  esCorrecta: boolean;

  @Prop()
  timestamp: Date;
}

export class ModuleResult {
  @Prop()
  modulo: number;

  @Prop()
  preguntasCorrectas: number;

  @Prop()
  preguntasTotales: number;

  @Prop()
  porcentaje: number;
}

@Schema({ timestamps: true })
export class QuizResponse extends Document {
  @Prop({ required: true, index: true })
  numeroUsuario: string;

  @Prop({ required: true })
  modulo: number;

  @Prop({ type: [Object] })
  respuestasDetalladas: QuestionResponse[];

  @Prop({ type: Object })
  resultadoModulo: ModuleResult;

  @Prop()
  timestamp: Date;
}

export const QuizResponseSchema = SchemaFactory.createForClass(QuizResponse);
