import { Request, Response } from 'express';
import AuthService from '@services/auth.service';
import logger from '@logger/logger';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

class AuthController {
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);

            if (!result) {
                throw new Error('Login failed');
            }

            res.cookie('token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 minutos
            });
            res.json({ refreshToken: result.refreshToken, csrfToken: result.csrfToken });
        } catch (err) {
            if (err instanceof Error) {
                logger.error('Error en login:', err);
                res.status(401).json({ message: err.message });
            } else {
                res.status(401).json({ message: 'Error desconocido en login' });
            }
        }
    }

    public async refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                throw new Error('User ID is missing');
            }

            const result = await AuthService.refresh(refreshToken, userId);

            if (!result) {
                throw new Error('Refresh failed');
            }

            res.cookie('token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 minutos
            });
            res.json({ csrfToken: result.csrfToken });
        } catch (err) {
            if (err instanceof Error) {
                logger.error('Error en refresh:', err);
                res.status(403).json({ message: err.message });
            } else {
                res.status(403).json({ message: 'Error desconocido en refresh' });
            }
        }
    }

    public async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const token = req.cookies.token;

            if (!userId || !token) {
                throw new Error('User ID or token is missing');
            }

            await AuthService.logout(userId, token);

            res.clearCookie('token');
            res.json({ message: 'Sesión cerrada exitosamente.' });
        } catch (err) {
            if (err instanceof Error) {
                logger.error('Error en logout:', err);
                res.status(400).json({ message: err.message });
            } else {
                res.status(400).json({ message: 'Error desconocido en logout' });
            }
        }
    }
}

export default new AuthController();