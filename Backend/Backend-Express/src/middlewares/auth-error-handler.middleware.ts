import { Request, Response, NextFunction } from 'express';
import logger from '@logger/logger';
import AuthenticationError from '@errors/AuthenticationError';

const authErrorHandler = (err: AuthenticationError, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AuthenticationError) {
        logger.warn(`Error de autenticación: ${err.message}`);
        res.status(401).json({ success: false, message: err.message });
        return;
    }
    _next(err);
};

export default authErrorHandler;