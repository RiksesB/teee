import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class SurveyAnswer {
  @Prop()
  numero: number;

  @Prop()
  pregunta: string;

  @Prop()
  respuesta: string;
}

export class ModuleSummary {
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
export class SurveyResponse extends Document {
  @Prop({ required: true, index: true })
  numeroUsuario: string;

  @Prop({ type: [Object] })
  respuestasEncuesta: SurveyAnswer[];

  @Prop({ type: [Object] })
  resultadosModulos: ModuleSummary[];

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  fecha_completado: Date;
}

export const SurveyResponseSchema = SchemaFactory.createForClass(SurveyResponse);
