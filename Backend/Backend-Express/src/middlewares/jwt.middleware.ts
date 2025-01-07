import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwks from 'jwks-rsa';
import Logger from '@logger/logger';
import { AUTH0_AUDIENCE, AUTH0_DOMAIN } from '@config/constants';

interface CustomJwtPayload extends JwtPayload {
    id: string; // Campo personalizado en tu payload
}

/**
 * Middleware para renovar tokens JWT cuando están expirados.
 */
const jwtMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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

/**
 * Configura `express-jwt` con claves públicas para validación de tokens.
 */
const configureJwtMiddleware = () => {
    return expressjwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
        }) as unknown as GetVerificationKey,
        audience: AUTH0_AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
        /**
         * Extrae el token de la solicitud. Si no está presente o es inválido, lanza un error.
         */
        getToken: (req) => {
            const token = req.cookies.token;
            if (!token) {
                Logger.error(`Token no encontrado en cookies desde IP: ${req.ip}`);
                throw new Error('Token de autenticación faltante. Por favor, inicie sesión.');
            }

            if (typeof token !== 'string' || token.trim() === '') {
                Logger.error(`Formato de token inválido desde IP: ${req.ip}, token: ${token}`);
                throw new Error('Token de autenticación inválido. Por favor, inicie sesión nuevamente.');
            }

            return token;
        },
    }).unless({
        path: ['/public', '/login'], // Rutas que no requieren autenticación
    });
};

export { jwtMiddleware, configureJwtMiddleware };
