import { IsString, IsNotEmpty, IsOptional, IsEnum, ValidateIf } from 'class-validator';

// DTO para crear una solicitud
export class CrearSolicitudDto {
    @IsString()
    @IsNotEmpty()
    public perfil!: string;

    @IsString()
    @IsEnum(['Plan', 'Casillero'], {
        message: 'El tipo de solicitud debe ser "Plan" o "Casillero".',
    })
    public tipo!: 'Plan' | 'Casillero';

    @ValidateIf((obj) => obj.tipo === 'Plan')
    @IsString()
    @IsNotEmpty({ message: 'El campo "plan" es obligatorio si el tipo es "Plan".' })
    public plan?: string;

    @ValidateIf((obj) => obj.tipo === 'Casillero')
    @IsString()
    @IsNotEmpty({ message: 'El campo "casillero" es obligatorio si el tipo es "Casillero".' })
    public casillero?: string;

    @IsString()
    @IsNotEmpty({ message: 'La imagen es obligatoria para comprobar el pago.' })
    public imagen!: string;
}

// DTO para eliminar una solicitud
export class EliminarSolicitudDto {
    @IsString()
    @IsNotEmpty()
    public solicitudId!: string;
}

// DTO para listar solicitudes con filtros
export class ListarSolicitudesQueryDto {
    @IsString()
    @IsOptional()
    @IsEnum(['Plan', 'Casillero'], {
        message: 'El tipo de solicitud debe ser "Plan" o "Casillero".',
    })
    public tipo?: string;

    @IsString()
    @IsOptional()
    @IsEnum(['Aprobado', 'Rechazado', 'Por verificar'], {
        message: 'El estado debe ser "Aprobado", "Rechazado" o "Por verificar".',
    })
    public estado?: string;
}

// DTO para actualizar el estado de una solicitud
export class ActualizarEstadoSolicitudDto {
    @IsString()
    @IsNotEmpty()
    public solicitudId!: string;

    @IsString()
    @IsEnum(['Aprobado', 'Rechazado', 'Por verificar'], {
        message: 'El estado debe ser "Aprobado", "Rechazado" o "Por verificar".',
    })
    public estado!: string;
}

// DTO para validar el parámetro de ID en los detalles de la solicitud
export class ObtenerSolicitudParamsDto {
    @IsString()
    @IsNotEmpty({ message: 'El ID de la solicitud es obligatorio.' })
    public id!: string;
}