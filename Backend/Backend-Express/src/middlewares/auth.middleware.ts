import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import RedisService from '@services/redis.service';
import logger from '@logger/logger';
import { AuthenticatedRequest } from '@type/global';

/**
 * Middleware para verificar el Access Token (JWT).
 */
const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Obtener el token de las cookies
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            logger.warn('No autorizado: token faltante.');
            res.status(401).json({ success: false, message: 'No autorizado: token faltante.' });
            return;
        }

        // Verificar token con JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // Extraer el `id` del payload y guardarlo en `req.user`
        const userId = decoded.userId as string;
        if (!userId) {
            logger.warn('No autorizado: ID de usuario faltante en el token.');
            res.status(403).json({ success: false, message: 'No autorizado: ID de usuario faltante en el token.' });
            return;
        }
        req.user = { id: userId };

        // Validar que el token no esté en la lista negra
        const isBlacklisted = await RedisService.getKey(`blacklist:${token}`);
        if (isBlacklisted) {
            logger.warn(`No autorizado: token inválido o expirado. Token: ${token}`);
            res.status(403).json({ success: false, message: 'No autorizado: token inválido o expirado.' });
            return;
        }

        next(); // Pasar al siguiente middleware o controlador
    } catch (err) {
        logger.error('No autorizado: token inválido o expirado.', err as Error);
        res.status(403).json({ success: false, message: 'No autorizado: token inválido o expirado.' });
    }
};

export default authenticateJWT;