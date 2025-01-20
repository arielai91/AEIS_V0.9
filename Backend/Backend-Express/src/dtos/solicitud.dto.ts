import { IsString, IsNotEmpty, IsEnum, IsMongoId, IsOptional, IsNumber, Min } from 'class-validator';

/**
 * DTO para crear una solicitud
 */
export class CrearSolicitudDto {
    @IsMongoId({ message: 'El ID del perfil debe ser un ObjectId válido.' })
    perfil!: string;

    @IsString()
    @IsEnum(['Plan', 'Casillero'], {
        message: 'El tipo de solicitud debe ser uno de los siguientes: Plan o Casillero.',
    })
    tipo!: 'Plan' | 'Casillero';

    @IsMongoId({ message: 'El ID del plan debe ser un ObjectId válido.' })
    @IsOptional()
    plan?: string;

    @IsMongoId({ message: 'El ID del casillero debe ser un ObjectId válido.' })
    @IsOptional()
    casillero?: string;

    @IsString()
    @IsNotEmpty({ message: 'La imagen del comprobante de pago es obligatoria.' })
    imagen!: string;
}

/**
 * DTO para filtrar solicitudes
 */
export class ListarSolicitudesQueryDto {
    @IsString()
    @IsEnum(['Aprobado', 'Rechazado', 'Por verificar'], {
        message: 'El estado debe ser uno de los siguientes: Aprobado, Rechazado, Por verificar.',
    })
    @IsOptional()
    estado?: string;

    @IsMongoId({ message: 'El ID del perfil debe ser un ObjectId válido.' })
    @IsOptional()
    perfil?: string;

    @IsString()
    @IsEnum(['Plan', 'Casillero'], {
        message: 'El tipo debe ser uno de los siguientes: Plan o Casillero.',
    })
    @IsOptional()
    tipo?: string;

    @IsNumber()
    @Min(1, { message: 'La página debe ser mayor o igual a 1.' })
    @IsOptional()
    page?: number;

    @IsNumber()
    @Min(1, { message: 'El límite debe ser mayor o igual a 1.' })
    @IsOptional()
    limit?: number;
}

/**
 * DTO para actualizar el estado de una solicitud
 */
export class ActualizarEstadoSolicitudDto {
    @IsMongoId({ message: 'El ID de la solicitud debe ser un ObjectId válido.' })
    solicitudId!: string;

    @IsString()
    @IsEnum(['Aprobado', 'Rechazado', 'Por verificar'], {
        message: 'El estado debe ser uno de los siguientes: Aprobado, Rechazado, Por verificar.',
    })
    estado!: 'Aprobado' | 'Rechazado' | 'Por verificar';
}

/**
 * DTO para eliminar una solicitud por ID
 */
export class SolicitudIdDto {
    @IsMongoId({ message: 'El ID de la solicitud debe ser un ObjectId válido.' })
    solicitudId!: string;
}

/**
 * DTO para validar el CSRF token
 */
export class CsrfTokenDto {
    @IsString()
    @IsNotEmpty({ message: 'El token CSRF es obligatorio.' })
    'x-csrf-token'!: string;
}
