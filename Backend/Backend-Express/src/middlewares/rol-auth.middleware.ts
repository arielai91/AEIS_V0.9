import { Response, NextFunction } from 'express';
import RedisService from '@services/redis.service';
import { AuthenticatedRequest, UserProfileRedis } from '@type/global';
import logger from '@logger/logger';

/**
 * Middleware para validar roles basados en Redis.
 * @param allowedRoles Lista de roles permitidos.
 */
const validateRole = (allowedRoles: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(403).json({ message: 'Usuario no autenticado.' });
                return;
            }

            const userProfileData = await RedisService.getHash(`profile:${userId}`);

            // Verificar si los datos del perfil contienen las propiedades necesarias
            if (!userProfileData || !userProfileData.rol) {
                logger.warn(`Perfil no encontrado en Redis para el usuario: ${userId}`);
                res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
                return;
            }

            const userProfile: UserProfileRedis = {
                id: userProfileData.id,
                nombreCompleto: userProfileData.nombreCompleto,
                email: userProfileData.email,
                rol: userProfileData.rol
            };

            if (!allowedRoles.includes(userProfile.rol)) {
                res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
                return;
            }

            next();
        } catch (err) {
            res.status(500).json({ message: `Error interno al validar roles: ${err}` });
        }
    };
};

export default validateRole;