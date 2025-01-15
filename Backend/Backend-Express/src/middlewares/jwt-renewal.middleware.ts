import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import Logger from '@logger/logger';

interface CustomJwtPayload extends JwtPayload {
    id: string; // Campo personalizado en tu payload
}

/**
 * Middleware para renovar tokens JWT cuando están expirados.
 */
const jwtRenewalMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token; // Extrae el token de las cookies
    if (!token) return next(); // Si no hay token, pasa al siguiente middleware

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            if (err) {
                // Si el token ha expirado, genera uno nuevo
                if (err.name === 'TokenExpiredError' && decoded) {
                    const payload = decoded as CustomJwtPayload; // Casting explícito
                    const newToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                    res.cookie('token', newToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                    });
                    Logger.info(`Token renovado para el usuario con ID: ${payload.id}`);
                } else {
                    Logger.error(`Error al verificar el token: ${err.message}`);
                    return next(err); // Otros errores relacionados con JWT
                }
            }
            next();
        }
    );
};

export default jwtRenewalMiddleware;