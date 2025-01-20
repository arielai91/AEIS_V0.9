import { Router } from 'express';
import CasilleroController from '@controllers/casillero.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateCsrfToken from '@middlewares/csrf.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import {
  CrearCasilleroDto,
  EliminarCasilleroDto,
  AsignarCasilleroDto,
  LiberarCasilleroDto,
  ActualizarEstadoDto,
  FiltroCasillerosQueryDto,
  CsrfTokenDto,
} from '@dtos/casillero.dto';
import validateRole from '@middlewares/rol-auth.middleware';

class CasilleroRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Crear un casillero
    this.router.post(
      '/',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(CrearCasilleroDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      CasilleroController.crearCasillero
    );

    // Obtener todos los casilleros
    this.router.get(
      '/',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']),
      validateRequest(FiltroCasillerosQueryDto, 'query'),
      CasilleroController.obtenerCasilleros
    );

    // Asignar un casillero a un perfil
    this.router.patch(
      '/asignar',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(AsignarCasilleroDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      CasilleroController.asignarCasillero
    );

    // Liberar un casillero
    this.router.patch(
      '/liberar',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(LiberarCasilleroDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      CasilleroController.liberarCasillero
    );

    // Actualizar el estado de un casillero
    this.router.patch(
      '/estado',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(ActualizarEstadoDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      CasilleroController.actualizarEstado
    );

    // Eliminar un casillero
    this.router.delete(
      '/',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(EliminarCasilleroDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      CasilleroController.eliminarCasillero
    );
  }
}

export default new CasilleroRoutes().router;