import { Request, Response, NextFunction } from 'express';
import RedisService from '@services/redis.service';
import AuthenticationError from '@errors/AuthenticationError';

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

        // Recuperar el token almacenado en Redis
        const storedCsrfToken = await RedisService.getKey(`csrf:${userId}`);
        if (!storedCsrfToken || storedCsrfToken !== csrfToken) {
            throw new AuthenticationError('CSRF token inválido o expirado');
        }

        // Si todo es válido, continuar con la solicitud
        next();
    } catch (err) {
        next(err);
    }
};

export default validateCsrfToken;