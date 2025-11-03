import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserSession extends Document {
  @Prop({ required: true, index: true })
  numeroUsuario: string;

  @Prop({ required: true })
  evento: string;

  @Prop({ required: true })
  iniciadoEn: Date;

  @Prop({ required: true })
  usarPlantilla: boolean;

  @Prop()
  timestamp: Date;

  @Prop()
  fecha_inicio: Date;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
