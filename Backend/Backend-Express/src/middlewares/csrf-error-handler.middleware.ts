import { Request, Response, NextFunction } from 'express';
import RedisService from '@services/redis.service';
import logger from '@logger/logger';
import CsrfError from '@errors/csrf-error';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

/**
 * Maneja errores relacionados con CSRF y valida el token contra Redis.
 */
const csrfErrorHandler = async (err: CsrfError, req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (err.code === 'EBADCSRFTOKEN') {
        logger.warn('CSRF token inválido o no proporcionado.');
        res.status(403).json({ message: 'CSRF token inválido o no proporcionado.' });
        return;
    }

    // Validar CSRF Token desde Redis
    const csrfToken = req.headers['x-csrf-token'] as string;
    const userId = req.user?.id; // Supone que `authenticateJWT` ya ha verificado el usuario

    if (!csrfToken || !userId) {
        logger.warn('CSRF token o usuario no válido.');
        res.status(403).json({ message: 'CSRF token o usuario no válido.' });
        return;
    }

    const storedCsrfToken = await RedisService.getKey(`csrf:${userId}`);
    if (!storedCsrfToken || storedCsrfToken !== csrfToken) {
        logger.warn('CSRF token no coincide o expirado.');
        res.status(403).json({ message: 'CSRF token no coincide o expirado.' });
        return;
    }

    next();
};

export default csrfErrorHandler;