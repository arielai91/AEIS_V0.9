import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwks from 'jwks-rsa';
import Logger from '@logger/logger';
import { AUTH0_AUDIENCE, AUTH0_DOMAIN } from '@config/constants';

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
        path: ['/public', '/login', '/register'], // Rutas que no requieren autenticación
    });
};

export default configureJwtMiddleware;