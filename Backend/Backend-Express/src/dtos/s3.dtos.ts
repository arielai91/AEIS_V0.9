import { IsString, Matches, IsMongoId } from 'class-validator';

/**
 * DTO para validar el nombre de archivos en imágenes estáticas.
 */
export class FileNameDto {
    @IsString({ message: 'El nombre del archivo debe ser una cadena de texto.' })
    @Matches(/^[\w,\s-]+\.[A-Za-z]{3,4}$/, { message: 'El nombre del archivo no es válido.' })
    fileName!: string;
}

/**
 * DTO para validar uploads de imágenes (tipo de contenido).
 */
export class UploadImageDto {
    @IsString({ message: 'El tipo de contenido debe ser una cadena de texto.' })
    @Matches(/^image\/(jpeg|png)$/, { message: 'El formato del archivo no permitido. Solo JPEG o PNG.' })
    contentType!: string;
}

/**
 * DTO para validar el ID de solicitudes (ObjectId válido).
 */
export class SolicitudIdDto {
    @IsMongoId({ message: 'El ID de la solicitud debe ser un ObjectId válido.' })
    id!: string;
}

/**
 * DTO para validar el token CSRF.
 */
export class CsrfTokenDto {
    @IsString({ message: 'El token CSRF debe ser una cadena de texto.' })
    @Matches(/^[A-Za-z0-9_-]{36,}$/, { message: 'El token CSRF no es válido.' })
    'x-csrf-token'!: string;
}