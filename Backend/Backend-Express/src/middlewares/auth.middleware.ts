import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import RedisService from '@services/redis.service';
import logger from '@logger/logger';

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

/**
 * Middleware para verificar el Access Token (JWT) y validarlo contra Redis.
 */
const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.token; // Obtener el token de las cookies

    if (!token) {
        logger.warn('No autorizado: token faltante.');
        res.status(401).json({ message: 'No autorizado: token faltante.' });
        return;
    }

    try {
        // Verificar token con JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;

        // Validar que el token no esté en la lista negra (Redis)
        const isBlacklisted = await RedisService.getKey(`blacklist:${token}`);
        if (isBlacklisted) {
            logger.warn('No autorizado: token inválido o expirado.');
            res.status(403).json({ message: 'No autorizado: token inválido o expirado.' });
            return;
        }

        next();
    } catch (err) {
        logger.error('No autorizado: token inválido o expirado.', err as Error);
        res.status(403).json({ message: 'No autorizado: token inválido o expirado.' });
    }
};

export default authenticateJWT;