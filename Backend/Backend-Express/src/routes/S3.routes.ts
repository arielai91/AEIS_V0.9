import { Router } from 'express';
import S3Controller from '@controllers/s3.controller';

class S3Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', S3Controller.getS3);
    // Puedes agregar más rutas aquí
  }
}

export default new S3Routes().router;