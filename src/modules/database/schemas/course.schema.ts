import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Schema de Módulo de Curso
 * Representa un módulo individual dentro de un curso
 */
export class CourseModule {
  @Prop({ required: true })
  title: string;

  @Prop()
  content?: string;

  @Prop()
  videoUrl?: string;

  @Prop({ type: [Object], default: [] })
  questions: {
    question: string;
    options: string[];
    correctAnswer: string; // Letra (A, B, C, D)
    feedback?: Record<string, string>; // { A: string, B: string, C: string }
  }[];

  @Prop({ type: Number, default: 0 })
  order: number;
}

/**
 * Schema de Curso
 * Representa un curso completo de capacitación en ciberseguridad
 */
@Schema({
  timestamps: true,
  collection: 'courses'
})
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    default: 'basic'
  })
  level: string;

  @Prop({ type: String, default: 'es' })
  language: string;

  @Prop({ type: [CourseModule], default: [] })
  modules: CourseModule[];

  @Prop({ type: Number, default: 30 })
  durationMinutes: number;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  enrolledCount: number;

  @Prop({ type: Number, default: 0 })
  completedCount: number;

  // Timestamps automáticos
  createdAt?: Date;
  updatedAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Índices para optimización
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ level: 1 });
CourseSchema.index({ language: 1 });
CourseSchema.index({ isActive: 1 });
CourseSchema.index({ createdAt: -1 });
CourseSchema.index({ tags: 1 });
