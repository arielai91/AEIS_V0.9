import logger from '@logger/logger';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Normaliza los encabezados a minúsculas para facilitar la validación.
 */
const normalizeHeaders = (headers: Record<string, unknown>): Record<string, unknown> => {
  return Object.keys(headers).reduce((normalized: Record<string, unknown>, key: string) => {
    normalized[key.toLowerCase()] = headers[key];
    return normalized;
  }, {});
};

/**
 * Middleware genérico para validar datos en el request.
 * @param dtoClass Clase DTO a utilizar para la validación.
 * @param source Indica de dónde obtener los datos a validar: 'body', 'query', 'params' o 'headers'. Por defecto, 'body'.
 */
const validateRequest = <T extends object>(
  dtoClass: new () => T,
  source: 'body' | 'query' | 'params' | 'headers' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar que la fuente sea válida
      if (!['body', 'query', 'params', 'headers'].includes(source)) {
        res.status(500).json({
          success: false,
          errors: ['Configuración de fuente de validación inválida.'],
        });
        return;
      }

      // Obtener los datos a validar (normalizando encabezados si es necesario)
      const dataToValidate = source === 'headers' ? normalizeHeaders(req.headers) : req[source];

      if (!dataToValidate) {
        res.status(400).json({
          success: false,
          errors: [`La fuente de validación ${source} está vacía o falta.`],
        });
        return;
      }

      // Transformar los datos en una instancia de la clase DTO
      const dto = plainToInstance(dtoClass, dataToValidate, { enableImplicitConversion: true });

      // Validar los datos transformados
      const errors: ValidationError[] = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: source !== 'headers', // No rechazar encabezados adicionales
      });

      // Si hay errores de validación, devolver una respuesta con los detalles
      if (errors.length > 0) {
        const formattedErrors = errors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints || {});
          return acc;
        }, {} as Record<string, string[]>);

        res.status(400).json({
          success: false,
          errors: formattedErrors,
        });
        return; // Detener el flujo si hay errores
      }

      next(); // Continuar al siguiente middleware o controlador
    } catch (err) {
      logger.error('Error en el middleware de validación:', err as Error);
      res.status(500).json({
        success: false,
        errors: ['Error interno del servidor durante la validación.'],
      });
    }
  };
};

export default validateRequest;