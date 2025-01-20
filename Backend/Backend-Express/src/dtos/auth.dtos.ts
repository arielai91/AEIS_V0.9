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
    @IsString()
    @IsNotEmpty()
    email?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    cedula?: string;

    @IsString()
    @IsNotEmpty()
    contraseña!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshDto:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Refresh Token para renovar el Access Token.
 *           example: abcdefghijklmnopqrstuvwxyz
 *       required:
 *         - refreshToken
 */
export class RefreshDto {
    @IsString()
    @IsNotEmpty()
    refreshToken!: string;
}