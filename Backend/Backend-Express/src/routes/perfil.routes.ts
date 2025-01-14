import { Router } from 'express';
import PerfilController from '@controllers/perfil.controller';
import validateRequest from '@middlewares/validateRequest.middleware';
import { CreatePerfilDto } from '@dtos/perfil.dto';
import { validatePerfilExists } from '@validations/perfil.validation';

class PerfilRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', validatePerfilExists, validateRequest(CreatePerfilDto), PerfilController.createPerfil);
    this.router.post('/login', PerfilController.logout);
    this.router.get('/prueba', PerfilController.prueba);
  }
}

export default new PerfilRoutes().router;