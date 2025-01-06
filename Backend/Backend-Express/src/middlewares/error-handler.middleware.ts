import { Request, Response } from 'express';
import AppError from '@errors/app-error';
import Logger from '@logger/logger';

const errorHandler = (err: Error, _req: Request, res: Response): void => {
  Logger.error(`Error caught by errorHandler: ${err.message}`, {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

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
};

export default errorHandler;