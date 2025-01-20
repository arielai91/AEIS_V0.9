import { IsString, IsNotEmpty, IsEnum, IsMongoId, IsNumber, Min } from 'class-validator';

/**
 * DTO para crear un casillero
 */
export class CrearCasilleroDto {
    @IsNumber()
    @Min(1, { message: 'El número del casillero debe ser mayor o igual a 1.' })
    numero!: number;
}

/**
 * DTO para eliminar un casillero
 */
export class EliminarCasilleroDto {
    @IsMongoId({ message: 'El ID del casillero debe ser un ObjectId válido.' })
    id!: string;
}

/**
 * DTO para asignar un casillero a un perfil
 */
export class AsignarCasilleroDto {
    @IsMongoId({ message: 'El ID del casillero debe ser un ObjectId válido.' })
    casilleroId!: string;

    @IsMongoId({ message: 'El ID del perfil debe ser un ObjectId válido.' })
    perfilId!: string;
}

/**
 * DTO para liberar un casillero
 */
export class LiberarCasilleroDto {
    @IsMongoId({ message: 'El ID del casillero debe ser un ObjectId válido.' })
    casilleroId!: string;
}

/**
 * DTO para actualizar el estado de un casillero
 */
export class ActualizarEstadoDto {
    @IsMongoId({ message: 'El ID del casillero debe ser un ObjectId válido.' })
    casilleroId!: string;

    @IsString()
    @IsEnum(['disponible', 'ocupado', 'reservado', 'mantenimiento'], {
        message: 'El estado debe ser uno de los siguientes: disponible, ocupado, reservado, mantenimiento.',
    })
    estado!: 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento';
}

/**
 * DTO para filtrar casilleros
 */
export class FiltroCasillerosQueryDto {
    @IsString()
    @IsEnum(['disponible', 'ocupado', 'reservado', 'mantenimiento'], {
        message: 'El estado debe ser uno de los siguientes: disponible, ocupado, reservado, mantenimiento.',
    })
    estado?: string;

    @IsNumber()
    @Min(1, { message: 'La página debe ser mayor o igual a 1.' })
    page?: number;

    @IsNumber()
    @Min(1, { message: 'El límite debe ser mayor o igual a 1.' })
    limit?: number;
}

/**
 * DTO para validar el CSRF token
 */
export class CsrfTokenDto {
    @IsString()
    @IsNotEmpty({ message: 'El token CSRF es obligatorio.' })
    'x-csrf-token'!: string;
}
