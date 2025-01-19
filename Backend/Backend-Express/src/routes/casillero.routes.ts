import { Router } from 'express';
import CasilleroController from '@controllers/casillero.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRole from '@middlewares/rol-auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import validateCsrfToken from '@middlewares/csrf.middleware';
import { CrearCasilleroDto, EliminarCasilleroDto, AsignarPerfilDto, LiberarCasilleroDto, ActualizarEstadoDto, ObtenerCasillerosQueryDto } from '@dtos/casillero.dto';

class CasilleroRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Ruta para que los administradores creen casilleros
    this.router.post(
      '/',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(CrearCasilleroDto, 'body'),
      validateCsrfToken,
      CasilleroController.crearCasillero
    );

    // Ruta para que los administradores eliminen casilleros
    this.router.delete(
      '/',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(EliminarCasilleroDto, 'body'),
      validateCsrfToken,
      CasilleroController.eliminarCasillero
    );

    // Ruta para asignar un perfil a un casillero
    this.router.patch(
      '/asignar-perfil',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(AsignarPerfilDto, 'body'),
      validateCsrfToken,
      CasilleroController.asignarPerfil
    );

    // Ruta para liberar un casillero
    this.router.patch(
      '/liberar',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(LiberarCasilleroDto, 'body'),
      validateCsrfToken,
      CasilleroController.liberarCasillero
    );

    // Ruta para cambiar el estado del casillero
    this.router.patch(
      '/estado',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(ActualizarEstadoDto, 'body'),
      validateCsrfToken,
      CasilleroController.actualizarEstado
    );

    // Ruta para obtener casilleros
    this.router.get(
      '/',
      authenticateJWT,
      validateRole(['Administrador', 'Cliente']),
      validateCsrfToken,
      validateRequest(ObtenerCasillerosQueryDto, 'query'),
      CasilleroController.obtenerCasilleros
    );
  }
}

export default new CasilleroRoutes().router;