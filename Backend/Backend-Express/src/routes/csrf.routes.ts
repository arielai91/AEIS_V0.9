import { Router, Request, Response } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

class CsrfRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/csrf-token', this.rateLimiter(), this.csrfTokenHandler);
    }

    private rateLimiter(): RateLimitRequestHandler {
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 10, // Limit to 10 requests per 15 minutes per IP
            message: 'Too many requests for CSRF token, please try again later.',
        });
    }

    private csrfTokenHandler(req: Request, res: Response): void {
        try {
            const csrfToken = req.csrfToken?.(); // Ensure CSRF middleware is properly attached
            if (!csrfToken) {
                res.status(500).json({ message: 'CSRF middleware is not properly configured.' });
                return;
            }
            res.json({ csrfToken });
        } catch {
            res.status(500).json({ message: 'An error occurred while generating the CSRF token.' });
        }
    }
}

export default new CsrfRoutes().router;