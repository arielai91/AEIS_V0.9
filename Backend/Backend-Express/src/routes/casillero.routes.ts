import { Router } from 'express';
import CasilleroController from '@controllers/casillero.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRole from '@middlewares/rol-auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import { CrearCasilleroDto, EliminarCasilleroDto } from '@dtos/casillero.dto';
import validateCsrfToken from '@middlewares/csrf.middleware';

class CasilleroRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Ruta para que los administradores creen casilleros
    this.router.post('/', authenticateJWT, validateRole(['Administrador']), validateRequest(CrearCasilleroDto), validateCsrfToken, CasilleroController.crearCasillero);

    // Ruta para que los administradores eliminen casilleros
    this.router.delete('/', authenticateJWT, validateRole(['Administrador']), validateRequest(EliminarCasilleroDto), validateCsrfToken, CasilleroController.eliminarCasillero);
  }
}

export default new CasilleroRoutes().router;