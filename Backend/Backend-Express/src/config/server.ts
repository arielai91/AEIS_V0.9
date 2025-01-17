import express, { Application } from 'express';
//import session from 'express-session'; // manejar sesiones en aplicaciones web
import compression from 'compression';
import dotenv from 'dotenv';
//import cookieParser from 'cookie-parser';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
//import csurf from 'csurf';
import { validateEnvVariables } from '@validations/validate-env';

// Middlewares
import errorHandler from '@middlewares/error-handler.middleware';
//import { authErrorHandler } from '@middlewares/auth-error-handler.middleware';
import requestLogger from '@middlewares/logger.middleware';
//import csrfErrorHandler from '@middlewares/csrf-error-handler.middleware';
import configureHelmet from '@middlewares/helmet-config.middleware';
//import Logger from '@logger/logger';
//import configureRateLimiting from '@middlewares/rate-limit.middleware';
//import configureCors from '@middlewares/cors.middleware';
//import authMiddleware from '@middlewares/auth.middleware';
//import jwtRenewalMiddleware from '@middlewares/jwt-renewal.middleware';
//import configureJwtMiddleware from '@middlewares/jwt-validation.middleware';

// Configs & Routes
import { API_ROUTES } from '@config/constants';
import perfilRoutes from '@routes/perfil.routes';
import casilleroRoutes from '@routes/casillero.routes';
import planRoutes from '@routes/plan.routes';
import S3Routes from '@routes/S3.routes';
// import authRoutes from '@routes/auth.routes';

// Load environment variables
dotenv.config();

class ServerConfig {
    public app: Application;
    //private sanitizedOrigins: string[] = [];
    //private corsCacheLastUpdated: number = 0;
    //private cacheExpirationMs: number = 10 * 60 * 1000; // 10 minutos

    constructor() {
        validateEnvVariables({
            JWT_SECRET: true,
            CORS_ALLOWED_ORIGINS: { required: false, default: 'http://localhost:3000' },
            MONGODB_URI: true,
        });
        this.app = express();
        //this.updateSanitizedOrigins(); // Initial cache population
        this.loadMiddlewares();
        this.loadRoutes();
        this.loadErrorHandlers();
    }

    // private updateSanitizedOrigins(): void {
    //     const now = Date.now();
    //     if (now - this.corsCacheLastUpdated < this.cacheExpirationMs) {
    //         Logger.info('Using cached CORS origins.');
    //         return; // Evita actualizar si la caché es válida
    //     }

    //     const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',');
    //     if (!allowedOrigins || allowedOrigins.length === 0) {
    //         Logger.error('CORS_ALLOWED_ORIGINS is undefined or empty. Defaulting to localhost.');
    //         this.sanitizedOrigins = ['http://localhost:3000'];
    //     } else {
    //         this.sanitizedOrigins = allowedOrigins.map((origin) => {
    //             try {
    //                 const url = new URL(origin);
    //                 return url.origin; // Ensure valid and sanitized origin
    //             } catch {
    //                 Logger.warn(`Invalid CORS origin: ${origin}`);
    //                 return null; // Discard invalid origins
    //             }
    //         }).filter(Boolean) as string[];
    //     }

    //     this.corsCacheLastUpdated = now;
    //     Logger.info('CORS origins updated.');
    // }

    private loadMiddlewares(): void {
        this.loadSecurityMiddlewares();
        this.loadPerformanceMiddlewares();
        this.loadRequestParsingMiddlewares();
        this.loadLoggingMiddlewares();
        this.loadAuthMiddlewares();
    }

    private loadSecurityMiddlewares(): void {
        this.configureSecurityMiddlewares();
        //this.app.use(configureCors(this.sanitizedOrigins));
        //this.app.use(cookieParser());
        //this.app.use(csurf({ cookie: true }));
        this.configureRateLimiting();
    }

    private configureSecurityMiddlewares(): void {
        this.app.use(configureHelmet());
        this.app.use(xss());
        this.app.use(mongoSanitize());
    }

    private loadPerformanceMiddlewares(): void {
        this.app.use(compression());
    }

    private loadRequestParsingMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private loadLoggingMiddlewares(): void {
        this.app.use(requestLogger);
    }

    private loadAuthMiddlewares(): void {
        // cosas relacionadas con jwt
        //this.app.use(authMiddleware);
        //this.app.use(jwtRenewalMiddleware);
        //this.app.use(configureJwtMiddleware);
    }

    private configureRateLimiting(): void {
        //this.app.use(configureRateLimiting());
    }

    private loadRoutes(): void {
        this.app.use(API_ROUTES.PERFILES, perfilRoutes);
        this.app.use(API_ROUTES.CASILLEROS, casilleroRoutes);
        this.app.use(API_ROUTES.PLANES, planRoutes);
        this.app.use(API_ROUTES.S3, S3Routes);
        // this.app.use(API_ROUTES.AUTH, authRoutes);
    }

    private loadErrorHandlers(): void {
        //this.app.use(authErrorHandler); // Usa el handler ya definido para errores de autenticación
        //this.app.use(csrfErrorHandler); // Usa el handler ya definido para errores de CSRF
        this.app.use(errorHandler); // Middleware global para errores restantes
    }
}

export default ServerConfig;
