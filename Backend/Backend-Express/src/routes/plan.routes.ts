import { Router } from 'express';
import PlanController from '@controllers/plan.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRole from '@middlewares/rol-auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import {
  CrearPlanDto,
  EliminarPlanDto,
  ActualizarPlanDto,
  ObtenerPlanesQueryDto,
  CambiarPlanPredeterminadoDto,
  AsignarUsuarioDto,
  EliminarUsuarioDto
} from '@dtos/plan.dto';
import validateCsrfToken from '@middlewares/csrf.middleware';

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
      validateRequest(CrearPlanDto, 'body'),
      validateCsrfToken,
      PlanController.crearPlan,
    );

    // Eliminar un plan
    this.router.delete(
      '/',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(EliminarPlanDto, 'body'),
      validateCsrfToken,
      PlanController.eliminarPlan,
    );

    // Actualizar un plan
    this.router.patch(
      '/actualizar',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(ActualizarPlanDto, 'body'),
      validateCsrfToken,
      PlanController.actualizarPlan,
    );

    // Obtener planes
    this.router.get(
      '/',
      authenticateJWT,
      validateRole(['Administrador', 'Cliente']),
      validateRequest(ObtenerPlanesQueryDto, 'query'),
      PlanController.obtenerPlanes,
    );

    // Cambiar el plan predeterminado
    this.router.patch(
      '/predeterminado',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(CambiarPlanPredeterminadoDto, 'body'),
      validateCsrfToken,
      PlanController.cambiarPlanPredeterminado,
    );

    // Asignar un usuario a un plan
    this.router.patch(
      '/asignar-usuario',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(AsignarUsuarioDto, 'body'),
      validateCsrfToken,
      PlanController.asignarUsuario,
    );

    // Eliminar un usuario de un plan
    this.router.patch(
      '/eliminar-usuario',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(EliminarUsuarioDto, 'body'),
      validateCsrfToken,
      PlanController.eliminarUsuario,
    );
  }
}

export default new PlanRoutes().router;
