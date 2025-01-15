import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import authMiddleware from '@middlewares/auth.middleware';

class AuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Ruta para iniciar sesión
        this.router.post('/login', AuthController.login);

        // Ruta para obtener el perfil del usuario autenticado
        this.router.get('/profile', authMiddleware, AuthController.getProfile);
    }
}

export default new AuthRoutes().router;