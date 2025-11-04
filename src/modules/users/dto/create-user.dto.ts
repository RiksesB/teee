import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'cliente@empresa.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Nombre completo o nombre de contacto',
    example: 'Juan Pérez',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ['super_admin', 'admin', 'client'],
    example: 'client',
    required: false,
  })
  @IsOptional()
  @IsEnum(['super_admin', 'admin', 'client'])
  role?: string;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Empresa XYZ S.A.',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Créditos iniciales',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  credits?: number;

  @ApiProperty({
    description: 'Estado del usuario',
    enum: ['active', 'inactive', 'suspended'],
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+58 424 1234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Número de empleados',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  employees?: number;
}
