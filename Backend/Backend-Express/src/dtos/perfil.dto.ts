import { IsString, IsEmail, IsNotEmpty, Matches, IsOptional, IsEnum, IsMongoId, Length } from 'class-validator';

/**
 * DTO para crear un perfil
 */
export class CrearPerfilDto {
  @IsEnum(['Administrador', 'Cliente'], { message: 'El rol debe ser Administrador o Cliente.' })
  @IsOptional()
  rol?: 'Administrador' | 'Cliente';

  @IsString()
  @IsNotEmpty()
  @Matches(/^.{1,30}$/, { message: 'El nombre completo debe tener un máximo de 30 caracteres.' })
  nombreCompleto!: string;

  @IsEmail({}, { message: 'El email debe ser válido.' })
  @Matches(/@epn\.edu\.ec$/, { message: 'El email debe ser del dominio epn.edu.ec.' })
  email!: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos numéricos.' })
  cedula!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, undefined, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  contraseña!: string;

  @IsMongoId({ message: 'El ID del plan debe ser un ObjectId válido.' })
  @IsOptional()
  plan?: string;
}

/**
 * DTO para actualizar un perfil
 */
export class ActualizarPerfilDto {
  @IsString()
  @IsOptional()
  @Matches(/^.{1,30}$/, { message: 'El nombre completo debe tener un máximo de 30 caracteres.' })
  nombreCompleto?: string;

  @IsEmail({}, { message: 'El email debe ser válido.' })
  @Matches(/@epn\.edu\.ec$/, { message: 'El email debe ser del dominio epn.edu.ec.' })
  @IsOptional()
  email?: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos numéricos.' })
  @IsOptional()
  cedula?: string;

  @IsString()
  @IsOptional()
  contraseña?: string;

  @IsMongoId({ message: 'El ID del plan debe ser un ObjectId válido.' })
  @IsOptional()
  plan?: string;
}

/**
 * DTO para validar un ID de perfil en los params
 */
export class PerfilIdDto {
  @IsMongoId({ message: 'El ID proporcionado no es válido.' })
  id!: string;
}

/**
 * DTO para validar parámetros en solicitudes asociadas
 */
export class SolicitudesQueryDto {
  @IsOptional()
  @IsString()
  estado?: 'Aprobado' | 'Rechazado' | 'Por verificar';

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

/**
 * DTO para validar el CSRF Token en los headers
 */
export class CsrfTokenDto {
  @IsString({ message: 'El token CSRF debe ser una cadena de texto.' })
  @IsNotEmpty()
  'x-csrf-token'!: string;
}