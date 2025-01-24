import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import AuthService from '@services/auth.service';
import logger from '@logger/logger';
import { AuthenticatedRequest } from '@type/global';
import { validateCedula, validateEmail } from '@validations/validators';

class AuthController {
    public async login(req: Request, res: Response): Promise<void> {
        try {
            let { email, cedula, contraseña } = req.body;

            const isEmailValid = validateEmail(email);
            const isCedulaValid = validateCedula(cedula);

            if (email === cedula) {
                if (isEmailValid) {
                    cedula = null;
                } else if (isCedulaValid) {
                    email = null;
                } else {
                    res.status(400).json({ message: 'Formato de email o cédula inválido', success: false });
                }
            }

            // Validar que al menos uno de los campos sea válido
            if (!isEmailValid && !isCedulaValid) {
                res.status(400).json({ message: 'Formato de email o cédula inválido', success: false });
            }

            const result = await AuthService.login(contraseña, email, cedula);

            res.cookie('token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 minutos
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
            });

            res.cookie('csrfToken', result.csrfToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 minutos
            });

            res.status(200).json({ message: 'Inicio de sesión exitoso', success: true});
        } catch (error) {
            logger.error('Error al iniciar sesión:', error as Error);

            const err = error as Error;

            if (err.message === 'Usuario no encontrado') {
                res.status(404).json({ message: 'Usuario no encontrado', success: false });
            } else if (err.message === 'Contraseña incorrecta') {
                res.status(401).json({ message: 'Contraseña incorrecta', success: false });
            } else {
                res.status(500).json({ message: 'Error interno del servidor', success: false });
            }
        }
    }

    public async refresh(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.token;
            const refreshToken = req.cookies.refreshToken;
            if (!token || !refreshToken) {
                res.status(400).json({ message: 'Falta el token o el refreshToken' });
                return;
            }

            // Decodificar el token para extraer el userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            const userId = decoded.userId as string;

            const result = await AuthService.refresh(refreshToken, userId);

            res.cookie('token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 minutos
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
            });

            res.cookie('csrfToken', result.csrfToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 minutos
            });

            res.status(200).json({ message: 'Tokens renovados con éxito', success: true });
        } catch (err) {
            logger.error('Error en refresh:', err as Error);
            res.status(403).json({ message: 'Error al renovar tokens', success: false });
        }
    }

    public async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const token = req.cookies.token;

            if (!userId || !token) {
                res.status(400).json({ message: 'Falta el token o el usuario', success: false });
                return;
            }

            await AuthService.logout(userId, token);

            res.clearCookie('token');
            res.clearCookie('refreshToken');
            res.clearCookie('csrfToken');
            res.status(200).json({ message: 'Sesión cerrada exitosamente', success: true });
        } catch (err) {
            logger.error('Error en logout:', err as Error);
            res.status(500).json({ message: 'Error al cerrar sesión', success: false });
        }
    }
}

export default new AuthController();