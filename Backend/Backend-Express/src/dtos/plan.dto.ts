import { IsString, IsNotEmpty, IsEnum, IsNumber, IsMongoId, Min, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO para crear un plan
 */
export class CrearPlanDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del plan es obligatorio.' })
    @IsEnum(['Sin Plan', 'Pantera Junior', 'Pantera Senior'], {
        message: 'El nombre debe ser uno de los siguientes: Sin Plan, Pantera Junior, Pantera Senior.',
    })
    nombre!: string;

    @IsNumber()
    @Min(0, { message: 'El precio debe ser mayor o igual a 0.' })
    precio!: number;

    @IsNumber()
    @Min(1, { message: 'La duración debe ser al menos 1 mes.' })
    duracion!: number;

    @IsString({ each: true })
    @IsOptional()
    beneficios?: string[];

    @IsOptional()
    @IsNumber()
    esPorDefecto?: boolean;
}

/**
 * DTO para obtener planes con filtros
 */
export class PlanesQueryDto {
    @IsString()
    @IsOptional()
    @IsEnum(['Sin Plan', 'Pantera Junior', 'Pantera Senior'], {
        message: 'El nombre del plan debe ser válido.',
    })
    nombre?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    precioMin?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    precioMax?: number;
}

/**
 * DTO para actualizar un plan
 */
export class ActualizarPlanDto {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsNumber()
    @IsOptional()
    precio?: number;

    @IsNumber()
    @IsOptional()
    duracion?: number;

    @IsOptional()
    @IsBoolean()
    esPorDefecto?: boolean; // Agregar esta línea
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
    @IsString()
    @IsNotEmpty({ message: 'El token CSRF es obligatorio.' })
    'x-csrf-token'!: string;
}
