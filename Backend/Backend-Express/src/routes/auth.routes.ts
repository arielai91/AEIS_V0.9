import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateCsrfToken from '@middlewares/csrf.middleware';

class AuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/login', AuthController.login);
        this.router.post('/refresh', authenticateJWT, validateCsrfToken, AuthController.refresh);
        this.router.post('/logout', authenticateJWT, validateCsrfToken, AuthController.logout);
    }
}

export default new AuthRoutes().router;