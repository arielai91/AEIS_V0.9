import express, { Application } from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import csurf from 'csurf';

// Middlewares
import errorHandler from '@middlewares/error-handler.middleware';
import { authErrorHandler } from '@middlewares/auth-error-handler.middleware';
import requestLogger from '@middlewares/logger.middleware';
import { jwtMiddleware, configureJwtMiddleware } from '@middlewares/jwt.middleware';
import csrfErrorHandler from '@middlewares/csrf-error-handler.middleware';
import configureHelmet from '@middlewares/helmet-config.middleware';
import Logger from '@logger/logger';
import configureRateLimiting from '@middlewares/rate-limit.middleware';
import configureCors from '@middlewares/cors.middleware';

// Configs & Routes
import { API_ROUTES } from '@config/constants';
import perfilRoutes from '@routes/perfil.routes';
import casilleroRoutes from '@routes/casillero.routes';
import planRoutes from '@routes/plan.routes';
import S3Routes from '@routes/S3.routes';

// Load environment variables
dotenv.config();

class ServerConfig {
    public app: Application;
    private sanitizedOrigins: string[] = [];

    constructor() {
        this.app = express();
        this.updateSanitizedOrigins(); // Initial cache population
        this.loadMiddlewares();
        this.loadRoutes();
        this.loadErrorHandlers();
    }

    private updateSanitizedOrigins(): void {
        const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',');

        if (!allowedOrigins || allowedOrigins.length === 0) {
            Logger.error('CORS_ALLOWED_ORIGINS is undefined or empty. Defaulting to localhost.');
            this.sanitizedOrigins = ['http://localhost:3000'];
            return;
        }

        this.sanitizedOrigins = allowedOrigins.map((origin) => {
            try {
                const url = new URL(origin);
                return url.origin; // Ensure valid and sanitized origin
            } catch {
                Logger.warn(`Invalid CORS origin: ${origin}`);
                return null; // Discard invalid origins
            }
        }).filter(Boolean) as string[]; // Remove null values

        if (this.sanitizedOrigins.length === 0) {
            Logger.error('No valid CORS origins found. Defaulting to localhost.');
            this.sanitizedOrigins = ['http://localhost:3000'];
        }
    }

    private loadMiddlewares(): void {
        this.loadSecurityMiddlewares();
        this.loadPerformanceMiddlewares();
        this.loadRequestParsingMiddlewares();
        this.loadLoggingMiddlewares();
        this.loadAuthMiddlewares();
    }

    private loadSecurityMiddlewares(): void {
        this.configureSecurityMiddlewares();
        this.app.use(configureCors(this.sanitizedOrigins));
        // 
        this.configureCsrfProtection();
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
        this.app.use(cookieParser());
    }

    private loadLoggingMiddlewares(): void {
        this.app.use(requestLogger);
    }

    private loadAuthMiddlewares(): void {
        this.app.use(configureJwtMiddleware());
        this.app.use(jwtMiddleware);
    }

    // TODO: Revisar configuración de CSRF
    private configureCsrfProtection(): void {
        const csrfProtection = csurf({ cookie: true });
        this.app.use(csrfProtection);

        // CSRF token route
        this.app.get('/csrf-token', jwtMiddleware, rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 10, // Limit to 10 requests per 15 minutes per IP
            message: 'Too many requests for CSRF token, please try again later.',
        }), (req, res) => {
            res.json({ csrfToken: req.csrfToken() });
        });
    }

    private configureRateLimiting(): void {
        this.app.use(configureRateLimiting());
    }

    private loadRoutes(): void {
        this.app.use(API_ROUTES.PERFILES, perfilRoutes);
        this.app.use(API_ROUTES.CASILLEROS, casilleroRoutes);
        this.app.use(API_ROUTES.PLANES, planRoutes);
        this.app.use(API_ROUTES.S3, S3Routes);
    }

    private loadErrorHandlers(): void {
        this.app.use(authErrorHandler); // Usa el handler ya definido para errores de autenticación
        this.app.use(csrfErrorHandler); // Usa el handler ya definido para errores de CSRF
        this.app.use(errorHandler); // Middleware global para errores restantes
    }
}

export default ServerConfig;
