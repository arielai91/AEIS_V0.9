import { Router } from 'express';
import PerfilController from '@controllers/perfil.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import { CrearPerfilDto } from '@dtos/perfil.dto';
import validateCsrfToken from '@middlewares/csrf.middleware';

class PerfilRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', validateRequest(CrearPerfilDto), PerfilController.crearPerfil); // Crear perfil
    this.router.delete('/', authenticateJWT, validateCsrfToken, PerfilController.eliminarPerfil); // Eliminar perfil
  }
}

export default new PerfilRoutes().router;