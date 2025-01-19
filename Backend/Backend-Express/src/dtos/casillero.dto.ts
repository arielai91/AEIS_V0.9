import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

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