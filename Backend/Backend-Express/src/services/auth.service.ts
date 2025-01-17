import bcrypt from 'bcrypt';
import PerfilModel from '@models/Perfil/Perfil';
import RedisService from '@services/redis.service';
import { generateAccessToken, generateRefreshToken, generateCsrfToken, getCsrfTokenTTL, getRefreshTokenTTL } from '@utils/token.utils';
import AuthenticationError from '@errors/AuthenticationError';
import Logger from '@logger/logger';

interface AuthResult {
    accessToken: string;
    refreshToken: string;
    csrfToken: string;
}

class AuthService {
    /**
     * Maneja el inicio de sesión, validando credenciales y generando tokens.
     */
    public async login(email: string, password: string): Promise<AuthResult> {
        const user = await PerfilModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.contraseña))) {
            throw new AuthenticationError('Credenciales inválidas');
        }

        const userId = user.id;
        const accessToken = generateAccessToken({ userId });
        const refreshToken = generateRefreshToken();
        const csrfToken = generateCsrfToken();

        await RedisService.setKey(`refresh:${userId}`, refreshToken, getRefreshTokenTTL());
        await RedisService.setKey(`csrf:${userId}`, csrfToken, getCsrfTokenTTL());

        Logger.info(`Usuario ${userId} inició sesión exitosamente.`);

        return { accessToken, refreshToken, csrfToken };
    }

    /**
     * Maneja la renovación de tokens, validando el Refresh Token y generando nuevos tokens.
     */
    public async refresh(refreshToken: string, userId: string): Promise<AuthResult> {
        const storedRefreshToken = await RedisService.getKey(`refresh:${userId}`);
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            throw new AuthenticationError('Refresh token inválido o expirado');
        }

        const accessToken = generateAccessToken({ userId });
        const csrfToken = generateCsrfToken();
        const newRefreshToken = generateRefreshToken();

        await RedisService.setKey(`refresh:${userId}`, newRefreshToken, getRefreshTokenTTL());
        await RedisService.setKey(`csrf:${userId}`, csrfToken, getCsrfTokenTTL());

        Logger.info(`Tokens renovados para el usuario ${userId}.`);

        return { accessToken, refreshToken: newRefreshToken, csrfToken };
    }

    /**
     * Maneja el cierre de sesión eliminando tokens del almacenamiento en Redis.
     */
    public async logout(userId: string, token: string): Promise<void> {
        await RedisService.deleteKey(`refresh:${userId}`);
        await RedisService.deleteKey(`csrf:${userId}`);
        await RedisService.setKey(`blacklist:${token}`, 'true', getCsrfTokenTTL());

        Logger.info(`Usuario ${userId} cerró sesión.`);
    }
}

export default new AuthService();
