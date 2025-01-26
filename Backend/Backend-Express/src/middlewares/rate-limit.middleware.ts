import rateLimit from 'express-rate-limit';
import Logger from '@logger/logger';
import RateLimitExceededError from '@errors/RateLimitExceededError';

const configureRateLimiting = () => {
    return rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes by default
        max: parseInt(process.env.RATE_LIMIT_MAX || '300', 10), // 100 requests per IP by default
        message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.',
        handler: (req, _res, next) => {
            Logger.warn(`Rate limit exceeded: ${req.ip}, URL: ${req.originalUrl}`);
            next(new RateLimitExceededError('Too many requests from this IP, please try again later.'));
        }
    });
};

export default configureRateLimiting;