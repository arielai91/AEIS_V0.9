import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

const validateRequest = <T extends object>(dtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToClass(dtoClass, req.body);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return; // Asegurar que se retorna después de enviar la respuesta
    }

    next();
  };
};

export default validateRequest;