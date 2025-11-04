import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Schema de Usuario para autenticación y gestión de cuentas
 * Soporta roles: Super Admin (gestión total), Admin (gestión de clientes) y Client (organizaciones)
 */
@Schema({
  timestamps: true,
  collection: 'users'
})
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    enum: ['super_admin', 'admin', 'client'],
    default: 'client'
  })
  role: string;

  // Campos específicos para clientes (organizaciones)
  @Prop({ trim: true })
  companyName?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: Number, default: 0 })
  employees?: number;

  @Prop({ type: Number, default: 0 })
  credits: number;

  // Estado de la cuenta
  @Prop({
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  })
  status: string;

  // Token de refresh para JWT
  @Prop()
  refreshToken?: string;

  // Fecha de último login
  @Prop()
  lastLoginAt?: Date;

  // Timestamps automáticos (createdAt, updatedAt)
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Índices adicionales para optimización
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
