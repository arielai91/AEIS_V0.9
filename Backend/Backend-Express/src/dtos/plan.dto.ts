import { IsString, IsNotEmpty, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CrearPlanDto {
    @IsString()
    @IsNotEmpty()
    public nombre!: string;

    @IsNumber()
    @IsNotEmpty()
    public precio!: number;

    @IsNumber()
    @IsOptional()
    public duracion?: number;

    @IsArray()
    @IsOptional()
    public beneficios?: string[];

    @IsBoolean()
    @IsOptional()
    public esPorDefecto?: boolean;
}

export class EliminarPlanDto {
    @IsString()
    @IsNotEmpty()
    public planId!: string;
}