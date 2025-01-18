import { Request, Response, NextFunction } from 'express';
import RedisService from '@services/redis.service';
import AuthenticationError from '@errors/AuthenticationError';
import logger from '@logger/logger';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

const validateCsrfToken = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
        // Extraer CSRF Token del encabezado
        const csrfToken = req.headers['x-csrf-token'] as string;

        // Obtenemos el userId del usuario autenticado (requerimos que `authenticateJWT` se haya ejecutado antes)
        const userId = req.user?.id;

        if (!csrfToken || !userId) {
            throw new AuthenticationError('CSRF token o usuario no válido');
        }

        if (!/^[a-f0-9]{64}$/.test(csrfToken)) {
            throw new AuthenticationError('Formato de CSRF token inválido');
        }

        // Recuperar el token almacenado en Redis

        const storedCsrfToken = await RedisService.getKey(`csrf:${userId}`);
        if (!storedCsrfToken) {
            throw new AuthenticationError('CSRF token no encontrado o expirado');
        }

        if (storedCsrfToken !== csrfToken) {
            throw new AuthenticationError('CSRF token no coincide');
        }

        // Si todo es válido, continuar con la solicitud
        next();
    } catch (err) {
        logger.error('Error en validación de CSRF token:', err as Error);
        next(err);
    }
};

export default validateCsrfToken;