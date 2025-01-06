import { Router } from 'express';
import CasilleroController from '@controllers/casillero.controller';

class CasilleroRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', CasilleroController.getCasillero);
    // Puedes agregar más rutas aquí
  }
}

export default new CasilleroRoutes().router;