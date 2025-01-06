import { Router } from 'express';
import PlanController from '@controllers/plan.controller';

class PlanRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', PlanController.getPlan);
    // Puedes agregar más rutas aquí
  }
}

export default new PlanRoutes().router;