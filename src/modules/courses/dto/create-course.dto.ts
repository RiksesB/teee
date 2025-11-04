import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUrl,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionDto {
  @ApiProperty({ description: 'Texto de la pregunta' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ description: 'Opciones de respuesta', type: [String] })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ description: 'Letra de la respuesta correcta (A, B, C, D)' })
  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @ApiProperty({ description: 'Retroalimentación para cada opción (A, B, C, D)' })
  @IsOptional()
  feedback?: Record<string, string>;
}

export class ModuleDto {
  @ApiProperty({ description: 'Título del módulo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Contenido del módulo (texto descriptivo)' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'URL del video tutorial' })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiPropertyOptional({ description: 'Preguntas del módulo', type: [QuestionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];

  @ApiPropertyOptional({ description: 'Orden del módulo' })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CreateCourseDto {
  @ApiProperty({ description: 'Título del curso', example: 'Ciberseguridad Básica' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Descripción del curso' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Nivel del curso',
    enum: ['basic', 'intermediate', 'advanced'],
    default: 'basic'
  })
  @IsOptional()
  @IsEnum(['basic', 'intermediate', 'advanced'])
  level?: string;

  @ApiPropertyOptional({ description: 'Idioma del curso', default: 'es' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Módulos del curso', type: [ModuleDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleDto)
  modules?: ModuleDto[];

  @ApiPropertyOptional({ description: 'Duración estimada en minutos', default: 30 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ description: 'URL de la imagen thumbnail' })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: 'Tags del curso', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Si el curso está activo', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
