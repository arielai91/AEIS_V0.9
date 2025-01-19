import { Request, Response, NextFunction } from 'express';
import RedisService from '@services/redis.service';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

interface UserProfile {
    id: string;
    nombreCompleto: string;
    email: string;
    rol: string;
}

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

            const userProfileData = await RedisService.getHash(`user:${userId}`);
            if (!userProfileData) {
                res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
                return;
            }

            const userProfile: UserProfile = JSON.parse(userProfileData.profile);
            userProfile.rol = userProfileData.rol;

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