import { Router } from 'express';
import PlanController from '@controllers/plan.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRole from '@middlewares/rol-auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import validateCsrfToken from '@middlewares/csrf.middleware';
import {
  CrearPlanDto,
  ActualizarPlanDto,
  AsignarUsuarioDto,
  EliminarUsuarioDto,
  PlanIdDto,
  PlanesQueryDto,
  CsrfTokenDto,
} from '@dtos/plan.dto';

class PlanRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Crear un plan
    this.router.post(
      '/',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(CrearPlanDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      PlanController.crearPlan
    );

    // TODO: PLANES PARA USUARIO 
    // Obtener todos los planes
    this.router.get(
      '/',
      authenticateJWT,
      validateRole(['Administrador', 'Cliente']),
      validateRequest(PlanesQueryDto, 'query'),
      PlanController.obtenerPlanes
    );

    // Actualizar un plan por ID
    this.router.patch(
      '/:id',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(PlanIdDto, 'params'),
      validateRequest(ActualizarPlanDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      PlanController.actualizarPlan
    );

    // Eliminar un plan por ID
    this.router.delete(
      '/:id',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(PlanIdDto, 'params'),
      validateRequest(CsrfTokenDto, 'headers'),
      PlanController.eliminarPlan
    );

    // Asignar usuario a un plan
    this.router.patch(
      '/asignar',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(AsignarUsuarioDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      PlanController.asignarUsuario
    );

    // Eliminar usuario de un plan
    this.router.patch(
      '/eliminar',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(EliminarUsuarioDto, 'body'),
      validateRequest(CsrfTokenDto, 'headers'),
      PlanController.eliminarUsuario
    );
  }
}

export default new PlanRoutes().router;
