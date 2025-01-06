import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwks from 'jwks-rsa';
import Logger from '@logger/logger';
import { AUTH0_AUDIENCE, AUTH0_DOMAIN } from '@config/constants';

interface CustomJwtPayload extends JwtPayload {
    id: string; // Campo personalizado en tu payload
}

const jwtMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;
    if (!token) return next();

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            if (err) {
                if (err.name === 'TokenExpiredError' && decoded) {
                    const payload = decoded as CustomJwtPayload; // Casting explícito
                    const newToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                    res.cookie('token', newToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                    });
                }
                return next(err);
            }
            next();
        }
    );
};

const configureJwtMiddleware = () => {
    return expressjwt({
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
        }) as GetVerificationKey,
        audience: AUTH0_AUDIENCE,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
        getToken: (req) => {
            const token = req.cookies.token;
            if (!token) {
                Logger.error(`Token not found in cookies from IP: ${req.ip}`);
                throw new Error('Authentication token is missing. Please log in.');
            }

            if (typeof token !== 'string' || token.trim() === '') {
                Logger.error(`Invalid token format from IP: ${req.ip}, token: ${token}`);
                throw new Error('Authentication token is invalid. Please log in again.');
            }

            return token;
        },
    }).unless({ path: ['/public', '/login'] });
};

export { jwtMiddleware, configureJwtMiddleware };