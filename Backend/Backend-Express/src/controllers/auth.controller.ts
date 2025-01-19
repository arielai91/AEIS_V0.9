import { Request, Response } from 'express';
import AuthService from '@services/auth.service';
import logger from '@logger/logger';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

class AuthController {
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, cedula, contraseña } = req.body;
            const result = await AuthService.login(contraseña, email, cedula);

            res.cookie('token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            res.status(200).json({
                refreshToken: result.refreshToken,
                csrfToken: result.csrfToken,
            });
        } catch (err) {
            logger.error('Error en login:', err as Error);
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    }

    public async refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                res.status(403).json({ message: 'Usuario no autenticado' });
                return;
            }

            const result = await AuthService.refresh(refreshToken, userId);

            res.cookie('token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });

            res.status(200).json({ csrfToken: result.csrfToken });
        } catch (err) {
            logger.error('Error en refresh:', err as Error);
            res.status(403).json({ message: 'Error al renovar tokens' });
        }
    }

    public async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const token = req.cookies.token;

            if (!userId || !token) {
                res.status(400).json({ message: 'Falta el token o el usuario' });
                return;
            }

            await AuthService.logout(userId, token);

            res.clearCookie('token');
            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        } catch (err) {
            logger.error('Error en logout:', err as Error);
            res.status(500).json({ message: 'Error al cerrar sesión' });
        }
    }
}

export default new AuthController();