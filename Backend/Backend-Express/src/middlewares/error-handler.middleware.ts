import { Request, Response, NextFunction } from 'express';
import logger from '@logger/logger';
import AppError from '@errors/app-error';

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
  try {
    logger.error(`Error caught by errorHandler: ${err.message}`, {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });

    if (!res || typeof res.status !== 'function') {
      logger.error('Invalid response object passed to errorHandler. Passing error to next middleware.');
      return next(err);
    }

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction && !(err instanceof AppError)
      ? 'Something went wrong. Please try again later.'
      : err.message;

    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      errorType: err instanceof AppError ? err.name : 'InternalError',
      timestamp: new Date().toISOString(),
    });
  } catch (handlerError) {
    // Verifica que handlerError sea del tipo correcto antes de usarlo
    if (handlerError instanceof Error) {
      logger.error(`Critical error in errorHandler: ${handlerError.message}`, {
        name: handlerError.name,
        message: handlerError.message,
        stack: handlerError.stack,
      });
    } else {
      logger.error('Critical error in errorHandler: Unknown error type.');
    }

    next(handlerError); // Pasa el error al siguiente middleware
  }
};

export default errorHandler;