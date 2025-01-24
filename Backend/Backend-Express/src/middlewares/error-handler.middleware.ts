import { Request, Response, NextFunction } from 'express';
import logger from '@logger/logger';
import AppError from '@errors/app-error';

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
  try {
    logger.error(`Error capturado por errorHandler: ${err.message}`, {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    if (!res || typeof res.status !== 'function') {
      logger.error('Objeto de respuesta inválido pasado a errorHandler. Pasando error al siguiente middleware.');
      return next(err);
    }

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction && !(err instanceof AppError)
      ? 'Algo salió mal. Por favor, inténtelo de nuevo más tarde.'
      : err.message;

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errorType: err instanceof AppError ? err.name : 'ErrorInterno',
      timestamp: new Date().toISOString(),
    });
  } catch (handlerError) {
    // Verifica que handlerError sea del tipo correcto antes de usarlo
    if (handlerError instanceof Error) {
      logger.error(`Error crítico en errorHandler: ${handlerError.message}`, {
        name: handlerError.name,
        message: handlerError.message,
        stack: handlerError.stack,
      });
    } else {
      logger.error('Error crítico en errorHandler: Tipo de error desconocido.');
    }

    next(handlerError); // Pasa el error al siguiente middleware
  }
};

export default errorHandler;