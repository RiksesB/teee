import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsPhoneNumber,
} from 'class-validator';

/**
 * DTO para registro de nuevos usuarios (clientes)
 */
export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de contacto es requerido' })
  name: string;

  @IsString({ message: 'El nombre de la empresa debe ser texto' })
  @IsOptional()
  companyName?: string;

  @IsString({ message: 'El teléfono debe ser texto' })
  @IsOptional()
  phone?: string;

  @IsNumber({}, { message: 'El número de empleados debe ser un número' })
  @IsOptional()
  employees?: number;
}
