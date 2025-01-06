import { Request, Response, NextFunction } from 'express';
import Logger from '@logger/logger';

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        if (process.env.LOG_LEVEL === 'verbose' || process.env.NODE_ENV !== 'production') {
            const logMessage = `${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`;
            Logger.info(logMessage);
        }
    });

    next();
};

export default requestLogger;