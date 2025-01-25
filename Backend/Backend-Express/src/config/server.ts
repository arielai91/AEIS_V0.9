import 'reflect-metadata';
import express, { Application } from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import { validateEnvVariables } from '@validations/validate-env';

// Middlewares
import errorHandler from '@middlewares/error-handler.middleware';
import authErrorHandler from '@middlewares/auth-error-handler.middleware';
import requestLogger from '@middlewares/logger.middleware';
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
import authRoutes from '@routes/auth.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '@config/swagger';
import solicitudesRoutes from '@routes/solicitudes.routes';

// Load environment variables
dotenv.config();

class ServerConfig {
    public app: Application;
    private sanitizedOrigins: string[] = [];
    private corsCacheLastUpdated: number = 0;
    private cacheExpirationMs: number = 10 * 60 * 1000; // 10 minutos

    constructor() {
        validateEnvVariables({
            // AWS Config
            AWS_ACCESS_KEY_ID: { required: true },
            AWS_SECRET_ACCESS_KEY: { required: true },
            AWS_REGION: { required: true },
            AWS_BUCKET_NAME: { required: true },

            // Server Config
            PORT: { required: false, default: 3000, type: 'number' },
            NODE_ENV: { required: false, default: 'development', type: 'string' },

            // MongoDB Config
            MONGODB_URI: { required: true },

            // JWT Config
            JWT_SECRET: { required: true },
            JWT_ACCESS_TOKEN_TTL: { required: false, default: '15m', type: 'string' },
            JWT_REFRESH_TOKEN_TTL: { required: false, default: 604800, type: 'number' },

            // CSRF Config
            CSRF_TOKEN_TTL: { required: false, default: 900, type: 'number' },

            // Redis Config
            REDIS_URL: { required: true },

            // CORS Config
            CORS_ALLOWED_ORIGINS: { required: false, default: 'http://localhost:3000', type: 'string' },

            // Rate Limit Config
            RATE_LIMIT_WINDOW_MS: { required: false, default: 15 * 60 * 1000, type: 'number' },
            RATE_LIMIT_MAX: { required: false, default: 100, type: 'number' },
            RATE_LIMIT_MESSAGE: { required: false, default: 'Too many requests, please try again later.', type: 'string' },
        });
        this.app = express();
        this.updateSanitizedOrigins(); // Initial cache population
        this.loadMiddlewares();
        this.loadRoutes();
        this.loadErrorHandlers();
    }

    private updateSanitizedOrigins(): void {
        const now = Date.now();
        if (now - this.corsCacheLastUpdated < this.cacheExpirationMs) {
            Logger.info('Using cached CORS origins.');
            return; // Evita actualizar si la caché es válida
        }

        const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',');
        if (!allowedOrigins || allowedOrigins.length === 0) {
            Logger.error('CORS_ALLOWED_ORIGINS is undefined or empty. Defaulting to localhost.');
            this.sanitizedOrigins = ['http://localhost:3000'];
        } else {
            this.sanitizedOrigins = allowedOrigins.map((origin) => {
                try {
                    const url = new URL(origin);
                    return url.origin; // Ensure valid and sanitized origin
                } catch {
                    Logger.warn(`Invalid CORS origin: ${origin}`);
                    return null; // Discard invalid origins
                }
            }).filter(Boolean) as string[];
        }

        this.corsCacheLastUpdated = now;
        Logger.info('CORS origins updated.');
    }

    private loadMiddlewares(): void {
        this.loadPerformanceMiddlewares(); // Middlewares de rendimiento
        this.loadSecurityMiddlewares();   // Middlewares de seguridad (CORS, Helmet, etc.)
        this.configureRateLimiting();    // Middlewares de Rate Limiting
        this.loadRequestParsingMiddlewares(); // Parsing de solicitudes (JSON, URL Encoded)
        this.loadLoggingMiddlewares();   // Registro de solicitudes
    }

    private loadSecurityMiddlewares(): void {
        this.configureSecurityMiddlewares(); // Helmet, xss-clean, mongo-sanitize
        this.app.use(configureCors(this.sanitizedOrigins)); // Configuración de CORS
        this.app.use(cookieParser()); // Parser de cookies
    }

    private configureSecurityMiddlewares(): void {
        this.app.use(configureHelmet()); // Configuración de encabezados de seguridad
        this.app.use(xss());             // Protección contra ataques XSS
        this.app.use(mongoSanitize({ replaceWith: '_' }));   // Protección contra inyecciones de MongoDB
    }

    private loadPerformanceMiddlewares(): void {
        this.app.use(compression()); // Middleware de compresión
    }

    private configureRateLimiting(): void {
        this.app.use(configureRateLimiting()); // Middleware de Rate Limiting
    }

    private loadRequestParsingMiddlewares(): void {
        this.app.use(express.json()); // Middleware para parsear JSON
        this.app.use(express.urlencoded({ extended: true })); // Middleware para datos codificados en URL
    }

    private loadLoggingMiddlewares(): void {
        this.app.use(requestLogger); // Middleware para registrar solicitudes
    }

    private loadRoutes(): void {
        this.app.use(API_ROUTES.PERFILES, perfilRoutes);     // Rutas de perfiles
        this.app.use(API_ROUTES.CASILLEROS, casilleroRoutes); // Rutas de casilleros
        this.app.use(API_ROUTES.PLANES, planRoutes);         // Rutas de planes
        this.app.use(API_ROUTES.SOLICITUDES, solicitudesRoutes); // Rutas de solicitudes
        this.app.use(API_ROUTES.S3, S3Routes);               // Rutas de S3
        this.app.use(API_ROUTES.AUTH, authRoutes);           // Rutas de autenticación
        this.app.use(API_ROUTES.DOCS, swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Rutas de documentación
    }

    private loadErrorHandlers(): void {
        this.app.use(authErrorHandler); // Middleware para manejar errores de autenticación
        this.app.use(csrfErrorHandler); // Middleware para manejar errores de CSRF
        this.app.use(errorHandler);     // Middleware global para otros errores
    }
}

export default ServerConfig;
