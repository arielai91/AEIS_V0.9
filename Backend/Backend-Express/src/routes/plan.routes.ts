import { Router } from 'express';
import PlanController from '@controllers/plan.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRole from '@middlewares/rol-auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import { CrearPlanDto, EliminarPlanDto } from '@dtos/plan.dto';
import validateCsrfToken from '@middlewares/csrf.middleware';

class PlanRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Ruta para que los administradores creen planes
    this.router.post('/', authenticateJWT, validateRole(['Administrador']), validateRequest(CrearPlanDto), validateCsrfToken, PlanController.crearPlan);

    // Ruta para que los administradores eliminen planes
    this.router.delete('/', authenticateJWT, validateRole(['Administrador']), validateRequest(EliminarPlanDto), validateCsrfToken, PlanController.eliminarPlan);
  }
}

export default new PlanRoutes().router;