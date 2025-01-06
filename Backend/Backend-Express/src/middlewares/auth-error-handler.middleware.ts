import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from 'express-jwt';
import AuthenticationError from '@errors/AuthenticationError';

export const authErrorHandler = (
    err: Error,
    _req: Request,
    _res: Response,
    next: NextFunction
): void => {
    if (err instanceof UnauthorizedError) {
        next(new AuthenticationError('Token inválido o no proporcionado.'));
    } else {
        next(err); // Pasa al siguiente middleware si no es un error de autenticación JWT
    }
};