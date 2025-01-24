import { IsString, IsNotEmpty, IsEnum, IsNumber, IsMongoId, Min, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO para crear un plan
 */
export class CrearPlanDto {
    @IsString({ message: 'El nombre del plan debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El nombre del plan es obligatorio.' })
    @IsEnum(['Sin Plan', 'Pantera Junior', 'Pantera Senior'], {
        message: 'El nombre debe ser uno de los siguientes: Sin Plan, Pantera Junior, Pantera Senior.',
    })
    nombre!: string;

    @IsNumber({}, { message: 'El precio debe ser un número.' })
    @Min(0, { message: 'El precio debe ser mayor o igual a 0.' })
    precio!: number;

    @IsNumber({}, { message: 'La duración debe ser un número.' })
    @Min(1, { message: 'La duración debe ser al menos 1 mes.' })
    duracion!: number;

    @IsString({ each: true, message: 'Cada beneficio debe ser una cadena de texto.' })
    @IsOptional()
    beneficios?: string[];

    @IsOptional()
    @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
    esPorDefecto?: boolean;
}

/**
 * DTO para obtener planes con filtros
 */
export class PlanesQueryDto {
    @IsString({ message: 'El nombre del plan debe ser una cadena de texto.' })
    @IsOptional()
    @IsEnum(['Sin Plan', 'Pantera Junior', 'Pantera Senior'], {
        message: 'El nombre del plan debe ser válido.',
    })
    nombre?: string;

    @IsNumber({}, { message: 'El precio mínimo debe ser un número.' })
    @IsOptional()
    @Min(0, { message: 'El precio mínimo debe ser mayor o igual a 0.' })
    precioMin?: number;

    @IsNumber({}, { message: 'El precio máximo debe ser un número.' })
    @IsOptional()
    @Min(0, { message: 'El precio máximo debe ser mayor o igual a 0.' })
    precioMax?: number;
}

/**
 * DTO para actualizar un plan
 */
export class ActualizarPlanDto {
    @IsString({ message: 'El nombre del plan debe ser una cadena de texto.' })
    @IsOptional()
    nombre?: string;

    @IsNumber({}, { message: 'El precio debe ser un número.' })
    @IsOptional()
    precio?: number;

    @IsNumber({}, { message: 'La duración debe ser un número.' })
    @IsOptional()
    duracion?: number;

    @IsOptional()
    @IsBoolean({ message: 'El valor debe ser verdadero o falso.' })
    esPorDefecto?: boolean;
}

/**
 * DTO para el ID de un plan
 */
export class PlanIdDto {
    @IsMongoId({ message: 'El ID del plan debe ser un ObjectId válido.' })
    id!: string;
}

/**
 * DTO para asignar un usuario a un plan
 */
export class AsignarUsuarioDto {
    @IsMongoId({ message: 'El ID del plan debe ser un ObjectId válido.' })
    planId!: string;

    @IsMongoId({ message: 'El ID del usuario debe ser un ObjectId válido.' })
    usuarioId!: string;
}

/**
 * DTO para eliminar un usuario de un plan
 */
export class EliminarUsuarioDto {
    @IsMongoId({ message: 'El ID del plan debe ser un ObjectId válido.' })
    planId!: string;

    @IsMongoId({ message: 'El ID del usuario debe ser un ObjectId válido.' })
    usuarioId!: string;
}

/**
 * DTO para el token CSRF
 */
export class CsrfTokenDto {
    @IsString({ message: 'El token CSRF debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El token CSRF es obligatorio.' })
    'x-csrf-token'!: string;
}
