import { IsString, Matches } from 'class-validator';

export class FileNameDTO {
    @IsString()
    @Matches(/^[\w,\s-]+\.[A-Za-z]{3,4}$/, { message: 'El nombre del archivo no es válido.' })
    fileName!: string;
}

export class UploadImageDTO {
    @IsString()
    @Matches(/^image\/(jpeg|png)$/, { message: 'El formato del archivo no permitido.' })
    contentType!: string;
}