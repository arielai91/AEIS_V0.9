import { IsString, IsNotEmpty, IsNumber, IsArray, IsBoolean, IsOptional, IsIn } from 'class-validator';

// DTO para crear un plan
export class CrearPlanDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['Sin Plan', 'Pantera Junior', 'Pantera Senior'], {
        message: 'El nombre del plan debe ser uno de los valores permitidos: Sin Plan, Pantera Junior, Pantera Senior.',
    })
    public nombre!: string;

    @IsNumber()
    @IsNotEmpty()
    public precio!: number;

    @IsNumber()
    @IsOptional()
    public duracion?: number;

    @IsArray()
    @IsOptional()
    @IsString({ each: true, message: 'Cada beneficio debe ser una cadena de texto.' })
    public beneficios?: string[];

    @IsBoolean()
    @IsOptional()
    public esPorDefecto?: boolean;
}

// DTO para eliminar un plan
export class EliminarPlanDto {
    @IsString()
    @IsNotEmpty()
    public planId!: string;
}

// DTO para actualizar un plan
export class ActualizarPlanDto {
    @IsString()
    @IsNotEmpty()
    public planId!: string;

    @IsString()
    @IsOptional()
    public nombre?: string;

    @IsNumber()
    @IsOptional()
    public precio?: number;

    @IsNumber()
    @IsOptional()
    public duracion?: number;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    public beneficios?: string[];

    @IsBoolean()
    @IsOptional()
    public esPorDefecto?: boolean;
}

// DTO para filtrar planes en consultas
export class ObtenerPlanesQueryDto {
    @IsString()
    @IsOptional()
    public nombre?: string;

    @IsNumber()
    @IsOptional()
    public precio?: number;

    @IsBoolean()
    @IsOptional()
    public esPorDefecto?: boolean;
}

// DTO para cambiar el plan predeterminado
export class CambiarPlanPredeterminadoDto {
    @IsString()
    @IsNotEmpty()
    public planId!: string;
}

// DTO para asignar un usuario a un plan
export class AsignarUsuarioDto {
    @IsString()
    @IsNotEmpty()
    public planId!: string;

    @IsString()
    @IsNotEmpty()
    public usuarioId!: string;
}

// DTO para eliminar un usuario de un plan
export class EliminarUsuarioDto {
    @IsString()
    @IsNotEmpty()
    public planId!: string;

    @IsString()
    @IsNotEmpty()
    public usuarioId!: string;
}
