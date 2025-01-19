import { Router } from 'express';
import PerfilController from '@controllers/perfil.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import { CrearPerfilDto, EliminarPerfilDto } from '@dtos/perfil.dto';
import validateCsrfToken from '@middlewares/csrf.middleware';
import validateRole from '@middlewares/rol-auth.middleware';

class PerfilRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Ruta para que los usuarios creen su propio perfil
    this.router.post('/', validateRequest(CrearPerfilDto), PerfilController.crearPerfil);

    // Ruta para que los administradores creen perfiles
    this.router.post('/admin', authenticateJWT, validateRole(['Administrador']), validateRequest(CrearPerfilDto), validateCsrfToken, PerfilController.crearPerfilAdmin);

    // Ruta para que los usuarios eliminen su propio perfil
    this.router.delete('/', authenticateJWT, validateCsrfToken, PerfilController.eliminarPerfil);

    // Ruta para que los administradores eliminen perfiles
    this.router.delete('/admin', authenticateJWT, validateRole(['Administrador']), validateRequest(EliminarPerfilDto), validateCsrfToken, PerfilController.eliminarPerfilAdmin);
  }
}

export default new PerfilRoutes().router;