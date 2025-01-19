import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CrearSolicitudDto {
    @IsString()
    @IsNotEmpty()
    public perfil!: string;

    @IsString()
    @IsEnum(['Plan', 'Casillero'])
    @IsNotEmpty()
    public tipo!: 'Plan' | 'Casillero';

    @IsString()
    @IsOptional()
    public plan?: string;

    @IsString()
    @IsOptional()
    public casillero?: string;

    @IsString()
    @IsOptional()
    public imagen?: string;
}

export class EliminarSolicitudDto {
    @IsString()
    @IsNotEmpty()
    public solicitudId!: string;
}