import { Router } from 'express';
import PerfilController from '@controllers/perfil.controller';
// validacion y .dto
//import validateRequest from '@middlewares/validateRequest.middleware';
//import { CreatePerfilDto } from '@dtos/perfil.dto';

class PerfilRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', PerfilController.getPerfil);
  }
}

export default new PerfilRoutes().router;