import bcrypt from 'bcrypt';
import PerfilModel, { IPerfil } from '@models/Perfil/Perfil';
import RedisService from '@services/redis.service';
import {
    generateAccessToken,
    generateRefreshToken,
    generateCsrfToken,
    getCsrfTokenTTL,
} from '@utils/token.utils';
import logger from '@logger/logger';

interface AuthResult {
    accessToken: string;
    refreshToken: string;
    csrfToken: string;
}

interface UserProfile {
    id: string;
    nombreCompleto: string;
    email: string;
    rol: string;
}

class AuthService {
    /**
     * Maneja el inicio de sesión de un usuario.
     * Valida credenciales, genera tokens y almacena datos en Redis.
     */
    public async login(contraseña: string, email?: string, cedula?: string): Promise<AuthResult> {
        const query = email ? { email } : { cedula };
        const user = await PerfilModel.findOne(query);

        if (!user || !(await bcrypt.compare(contraseña, user.contraseña))) {
            throw new Error('Credenciales inválidas');
        }

        const userId = user.id;
        const accessToken = generateAccessToken({ userId });
        const refreshToken = generateRefreshToken();
        const csrfToken = generateCsrfToken();

        const userProfile = this.filterProfileData(user);

        // Almacena datos del usuario en Redis como un hash
        await RedisService.setHash(`user:${userId}`, {
            refreshToken,
            csrfToken,
            rol: userProfile.rol,
            profile: JSON.stringify(userProfile),
        });

        logger.info(`Usuario ${userId} inició sesión exitosamente.`);
        return { accessToken, refreshToken, csrfToken };
    }

    /**
     * Filtro para datos de perfil que deben almacenarse.
     */
    private filterProfileData(user: IPerfil): UserProfile {
        return {
            id: user.id || user._id.toString(),
            nombreCompleto: user.nombreCompleto,
            email: user.email,
            rol: user.rol,
        };
    }

    /**
     * Renueva los tokens del usuario y actualiza la información en Redis.
     */
    public async refresh(refreshToken: string, userId: string): Promise<AuthResult> {
        const userData = await RedisService.getHash(`user:${userId}`);
        if (!userData || userData.refreshToken !== refreshToken) {
            throw new Error('Refresh token inválido o expirado');
        }

        const accessToken = generateAccessToken({ userId });
        const csrfToken = generateCsrfToken();
        const newRefreshToken = generateRefreshToken();

        await RedisService.setHash(`user:${userId}`, {
            ...userData,
            refreshToken: newRefreshToken,
            csrfToken,
        });

        logger.info(`Tokens renovados para el usuario ${userId}.`);
        return { accessToken, refreshToken: newRefreshToken, csrfToken };
    }

    /**
     * Maneja el cierre de sesión de un usuario.
     * Elimina datos del usuario en Redis y agrega el token a la blacklist.
     */
    public async logout(userId: string, token: string): Promise<void> {
        await RedisService.deleteKey(`user:${userId}`);
        await RedisService.setKey(`blacklist:${token}`, 'true', getCsrfTokenTTL());

        logger.info(`Usuario ${userId} cerró sesión.`);
    }
}

export default new AuthService();