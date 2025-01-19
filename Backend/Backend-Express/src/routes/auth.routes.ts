import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateCsrfToken from '@middlewares/csrf.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import { LoginDto, RefreshDto } from '@dtos/auth.dtos';

class AuthRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Define las rutas y agrega documentación para Swagger.
     */
    private initializeRoutes(): void {
        /**
         * @swagger
         * /auth/login:
         *   post:
         *     summary: Inicia sesión en la aplicación.
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LoginDto'
         *     responses:
         *       200:
         *         description: Inicio de sesión exitoso.
         *       400:
         *         description: Error de validación en los datos.
         */
        this.router.post('/login', validateRequest(LoginDto), AuthController.login);

        /**
         * @swagger
         * /auth/refresh:
         *   post:
         *     summary: Renueva el token de acceso mediante un Refresh Token.
         *     tags: [Auth]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RefreshDto'
         *     responses:
         *       200:
         *         description: Tokens renovados con éxito.
         *       401:
         *         description: Token inválido o expirado.
         */
        this.router.post('/refresh', validateRequest(RefreshDto), AuthController.refresh);

        /**
         * @swagger
         * /auth/logout:
         *   post:
         *     summary: Cierra la sesión del usuario.
         *     tags: [Auth]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Sesión cerrada exitosamente.
         *       401:
         *         description: No autorizado.
         */
        this.router.post('/logout', authenticateJWT, validateCsrfToken, AuthController.logout);
    }
}

export default new AuthRoutes().router;