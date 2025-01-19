import { IsString, IsEmail, IsNotEmpty, IsEnum, Matches } from 'class-validator';

export class CrearPerfilDto {
  @IsEnum(['Administrador', 'Cliente'])
  rol!: 'Administrador' | 'Cliente';

  @IsString()
  @IsNotEmpty()
  nombreCompleto!: string;

  @IsEmail({}, { message: 'El email debe ser válido y del dominio epn.edu.ec' })
  @Matches(/@epn\.edu\.ec$/, { message: 'El email debe ser del dominio epn.edu.ec' })
  email!: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos numéricos' })
  cedula!: string;

  @IsString()
  @IsNotEmpty()
  contraseña!: string;
}