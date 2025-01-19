import authenticateJWT from '@middlewares/auth.middleware';
import { Router } from 'express';
import multer from 'multer';
import S3Controller from '@controllers/s3.controller';
import validateCsrfToken from '@middlewares/csrf.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import { FileNameDTO, UploadImageDTO } from '@dtos/s3.dtos';

class S3Routes {
  public router: Router;
  private upload: multer.Multer;

  constructor() {
    this.router = Router();
    this.upload = multer(); // Middleware de Multer para manejar archivos.
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Rutas para imágenes estáticas
    this.router.get('/static/:fileName', validateRequest(FileNameDTO, 'body'), S3Controller.serveStaticImage);

    // Rutas para imágenes de perfil
    this.router.get('/perfil/', authenticateJWT, validateCsrfToken, S3Controller.servePerfilImage);
    this.router.post('/perfil/', authenticateJWT, this.upload.single('image'), validateCsrfToken, validateRequest(UploadImageDTO, 'body'), S3Controller.uploadPerfilImage);
    this.router.put('/perfil/', authenticateJWT, this.upload.single('image'), validateCsrfToken, validateRequest(UploadImageDTO, 'body'), S3Controller.updatePerfilImage);
    this.router.delete('/perfil/', authenticateJWT, validateCsrfToken, validateRequest(FileNameDTO, 'body'), S3Controller.deletePerfilImage);
  }
}

export default new S3Routes().router;