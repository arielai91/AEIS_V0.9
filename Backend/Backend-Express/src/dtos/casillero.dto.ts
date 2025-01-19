// casillero.dtos.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';

export class CrearCasilleroDto {
    @IsNumber()
    @IsNotEmpty()
    public numero!: number;

    @IsString()
    @IsOptional()
    public estado?: string;

    @IsString()
    @IsOptional()
    public perfil?: string;
}

export class EliminarCasilleroDto {
    @IsString()
    @IsNotEmpty()
    public casilleroId!: string;
}

export class AsignarPerfilDto {
    @IsString()
    @IsNotEmpty()
    public casilleroId!: string;

    @IsString()
    @IsNotEmpty()
    public perfilId!: string;
}

export class LiberarCasilleroDto {
    @IsString()
    @IsNotEmpty()
    public casilleroId!: string;
}

export class ActualizarEstadoDto {
    @IsString()
    @IsNotEmpty()
    public casilleroId!: string;

    @IsEnum(['disponible', 'ocupado', 'reservado', 'mantenimiento'], {
        message: 'Estado no válido.',
    })
    public estado!: string;
}

export class ObtenerCasillerosQueryDto {
    @IsEnum(['disponible', 'ocupado', 'reservado', 'mantenimiento'], {
        message: 'Estado no válido.',
    })
    @IsOptional()
    public estado?: string;

    @IsString()
    @IsOptional()
    public perfilId?: string;

    @IsNumber()
    @Min(1, { message: 'El número del casillero debe ser positivo.' })
    @IsOptional()
    public numero?: number;
}