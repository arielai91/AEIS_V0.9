import { Router } from 'express';
import S3Controller from '@controllers/s3.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateCsrfToken from '@middlewares/csrf.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import upload from '@middlewares/multer.middleware';
import { FileNameDto, SolicitudIdDto, CsrfTokenDto } from '@dtos/s3.dtos';
import validateRole from '@middlewares/rol-auth.middleware';
class S3Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Imágenes estáticas
    this.router.get(
      '/static/:fileName',
      validateRequest(FileNameDto, 'params'), // Validación del nombre del archivo
      S3Controller.serveStaticImage
    );

    // Imágenes de perfil
    this.router.get(
      '/perfil',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']), // Solo los clientes y administradores pueden acceder
      validateCsrfToken,
      S3Controller.servePerfilImage
    );

    this.router.post(
      '/perfil',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']), // Solo los clientes y administradores pueden acceder
      validateCsrfToken,
      validateRequest(CsrfTokenDto, 'headers'), // Validación del CSRF Token
      upload.single('image'), // Usa el middleware personalizado para manejar la imagen
      S3Controller.uploadPerfilImage
    );

    this.router.put(
      '/perfil',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']), // Solo los clientes y administradores pueden acceder
      validateCsrfToken,
      validateRequest(CsrfTokenDto, 'headers'), // Validación del CSRF Token
      upload.single('image'), // Usa el middleware personalizado para manejar la imagen
      S3Controller.updatePerfilImage
    );

    this.router.delete(
      '/perfil',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']), // Solo los clientes y administradores pueden acceder
      validateCsrfToken,
      validateRequest(CsrfTokenDto, 'headers'), // Validación del CSRF Token
      S3Controller.deletePerfilImage
    );

    // Imágenes de solicitudes
    this.router.get(
      '/solicitud/:id',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(SolicitudIdDto, 'params'), // Validación del ID de la solicitud
      S3Controller.serveSolicitudImage
    );

    this.router.post(
      '/solicitud/:id',
      authenticateJWT,
      validateRole(['Administrador', 'Cliente']),
      validateRequest(CsrfTokenDto, 'headers'), // Validación del CSRF Token
      validateCsrfToken,
      validateRequest(SolicitudIdDto, 'params'), // Validación del ID de la solicitud
      upload.single('image'), // Usa el middleware personalizado para manejar la imagen
      S3Controller.uploadSolicitudImage
    );

    this.router.delete(
      '/solicitud/:id',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(SolicitudIdDto, 'params'), // Validación del ID de la solicitud
      validateRequest(CsrfTokenDto, 'headers'), // Validación del CSRF Token
      S3Controller.deleteSolicitudImage
    );
  }
}

export default new S3Routes().router;
