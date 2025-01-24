import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email del usuario. Opcional si se usa la cédula.
 *           example: usuario@example.com
 *         cedula:
 *           type: string
 *           description: Cédula del usuario. Opcional si se usa el email.
 *           example: 1234567890
 *         contraseña:
 *           type: string
 *           description: Contraseña del usuario.
 *           example: password123
 *       required:
 *         - contraseña
 */
export class LoginDto {
    @IsOptional()
    @IsString({ message: 'El email debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El email no puede estar vacío.' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'La cédula debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La cédula no puede estar vacía.' })
    cedula?: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
    contraseña!: string;
}
