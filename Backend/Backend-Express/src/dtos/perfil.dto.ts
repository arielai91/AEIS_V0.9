import { IsString, IsEmail, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class CreatePerfilDto {
  @IsEnum(['Administrador', 'Cliente'])
  rol!: 'Administrador' | 'Cliente';

  @IsString()
  nombreCompleto!: string;

  @IsEmail()
  email!: string;

  @IsString()
  cedula!: string;

  @IsString()
  contraseña!: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsUUID()
  casillero!: string;

  @IsUUID()
  @IsOptional()
  plan?: string;
}

export class UpdatePerfilDto {
  @IsOptional()
  @IsEnum(['Administrador', 'Cliente'])
  rol?: 'Administrador' | 'Cliente';

  @IsOptional()
  @IsString()
  nombreCompleto?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  contraseña?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsUUID()
  casillero?: string;

  @IsOptional()
  @IsUUID()
  plan?: string;
}