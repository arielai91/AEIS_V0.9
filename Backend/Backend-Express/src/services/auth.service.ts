import bcrypt from 'bcrypt';
import PerfilModel, { IPerfil } from '@models/Perfil/Perfil';
import RedisService from '@services/redis.service';
import {
    generateAccessToken,
    generateRefreshToken,
    generateCsrfToken,
    getCsrfTokenTTL,
    getRefreshTokenTTL,
} from '@utils/token.utils';
import logger from '@logger/logger';
import { UserProfileRedis, AuthResult } from '@type/global';


class AuthService {
    /**
     * Maneja el inicio de sesión de un usuario.
     * Valida credenciales, genera tokens y almacena datos en Redis como claves independientes.
     */
    public async login(contraseña: string, email?: string, cedula?: string): Promise<AuthResult> {
        const query = email ? { email } : { cedula };
        const user = await PerfilModel.findOne(query).select('+contraseña');

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (!user.contraseña || !(await bcrypt.compare(contraseña, user.contraseña))) {
            throw new Error('Contraseña incorrecta');
        }

        const userId = user.id;
        const accessToken = generateAccessToken({ userId });
        const refreshToken = generateRefreshToken();
        const csrfToken = generateCsrfToken();

        const userProfile = this.filterProfileData(user);
        const rol = userProfile.rol;
        // Convertir userProfile a Record<string, string | number>
        const userProfileRecord: Record<string, string | number> = {
            id: userProfile.id,
            nombreCompleto: userProfile.nombreCompleto,
            email: userProfile.email,
            rol: userProfile.rol,
        };

        await RedisService.setKey(`refreshToken:${userId}`, refreshToken, getRefreshTokenTTL());
        await RedisService.setKey(`csrfToken:${userId}`, csrfToken, getCsrfTokenTTL());
        await RedisService.setHashWithTTL(`profile:${userId}`, userProfileRecord, getCsrfTokenTTL());

        logger.info(`Usuario ${userId} inició sesión exitosamente.`);
        return { accessToken, refreshToken, csrfToken, rol };
    }

    /**
     * Filtro para datos de perfil que deben almacenarse.
     */
    private filterProfileData(user: IPerfil): UserProfileRedis {
        return {
            id: user.id || user._id.toString(),
            nombreCompleto: user.nombreCompleto,
            email: user.email,
            rol: user.rol,
        };
    }

    /**
     * Renueva los tokens del usuario y actualiza las claves independientes en Redis.
     */
    public async refresh(refreshToken: string, userId: string): Promise<AuthResult> {
        // Verificar si el refresh token es válido
        const storedRefreshToken = await RedisService.getKey(`refreshToken:${userId}`);
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            throw new Error('Refresh token inválido o expirado');
        }

        // Generar nuevos tokens
        const accessToken = generateAccessToken({ userId });
        const csrfToken = generateCsrfToken();
        const newRefreshToken = generateRefreshToken();

        // Almacenar el nuevo refresh token en Redis con su TTL
        await RedisService.setKey(`refreshToken:${userId}`, newRefreshToken, getRefreshTokenTTL());

        // Actualizar el perfil en Redis con nuevo TTL
        const user = await PerfilModel.findById(userId).select('id nombreCompleto email rol').lean();
        const rol = user?.rol;

        if (user && user._id) {
            const userRecord: Record<string, string | number> = {
                id: user._id.toString(),
                nombreCompleto: user.nombreCompleto,
                email: user.email,
                rol: user.rol,
            };
            await RedisService.setHashWithTTL(`profile:${userId}`, userRecord, getCsrfTokenTTL());
        } else {
            logger.error(`Usuario no encontrado o sin ID: ${userId}`);
            throw new Error('Usuario no encontrado');
        }

        // Actualizar el `csrfToken` en Redis
        await RedisService.setKey(`csrfToken:${userId}`, csrfToken, getCsrfTokenTTL());

        logger.info(`Tokens renovados para el usuario ${userId}.`);
        return { accessToken, refreshToken: newRefreshToken, csrfToken, rol };
    }
    /**
     * Maneja el cierre de sesión del usuario.
     */
    public async logout(userId: string, token: string): Promise<void> {
        // Eliminar las claves relacionadas con el usuario
        await RedisService.deleteKey(`refreshToken:${userId}`);
        await RedisService.deleteKey(`csrfToken:${userId}`);
        await RedisService.deleteKey(`profile:${userId}`);
        await RedisService.setKey(`blacklist:${token}`, 'true', getCsrfTokenTTL());

        logger.info(`Usuario ${userId} cerró sesión.`);
    }
}

export default new AuthService();