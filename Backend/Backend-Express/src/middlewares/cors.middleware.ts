import cors from 'cors';
import Logger from '@logger/logger';

const configureCors = (sanitizedOrigins: string[]) => {
    return cors({
        origin: (origin, callback) => {
            if (!origin || sanitizedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                Logger.warn(`Blocked CORS request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
        credentials: true,
    });
};

export default configureCors;