import { Router } from 'express';
import PerfilController from '@controllers/perfil.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateCsrfToken from '@middlewares/csrf.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import validateRole from '@middlewares/rol-auth.middleware';
import { CrearPerfilDto, ActualizarPerfilDto, PerfilIdDto, SolicitudesQueryDto, CsrfTokenDto } from '@dtos/perfil.dto';

class PerfilRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Gestión Básica del Perfil
    this.router.post(
      '/',
      validateRequest(CrearPerfilDto, 'body'), // Validación del body
      PerfilController.crearPerfil // Sin autenticación ni CSRF para esta ruta
    );

    this.router.get(
      '/',
      authenticateJWT, // JWT para autenticar al usuario
      validateRole(['Cliente', 'Administrador']), // Solo los clientes pueden acceder
      PerfilController.obtenerPerfil
    );

    this.router.patch(
      '/',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']), // Solo los clientes pueden acceder
      validateCsrfToken,
      validateRequest(CsrfTokenDto, 'headers'), // Validar CSRF Token en headers
      validateRequest(ActualizarPerfilDto, 'body'), // Validar datos del body
      PerfilController.actualizarPerfil
    );

    this.router.delete(
      '/',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']), // Solo los clientes pueden acceder
      validateCsrfToken,
      validateRequest(CsrfTokenDto, 'headers'), // Validar CSRF Token en headers
      PerfilController.eliminarPerfil
    );

    // Gestión Avanzada de Perfiles (Administrador)
    this.router.post(
      '/admin',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(CsrfTokenDto, 'headers'), // Validar CSRF Token en headers
      validateRequest(CrearPerfilDto, 'body'), // Validar datos del body
      PerfilController.crearPerfilAdmin
    );

    this.router.get(
      '/admin/:id',
      authenticateJWT,
      validateRole(['Administrador']),
      validateRequest(PerfilIdDto, 'params'), // Validar ID en params
      PerfilController.obtenerPerfilPorId
    );

    this.router.patch(
      '/admin/:id',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(CsrfTokenDto, 'headers'), // Validar CSRF Token en headers
      validateRequest(PerfilIdDto, 'params'), // Validar ID en params
      validateRequest(ActualizarPerfilDto, 'body'), // Validar datos del body
      PerfilController.actualizarPerfilAdmin
    );

    this.router.delete(
      '/admin/:id',
      authenticateJWT,
      validateRole(['Administrador']),
      validateCsrfToken,
      validateRequest(CsrfTokenDto, 'headers'), // Validar CSRF Token en headers
      validateRequest(PerfilIdDto, 'params'), // Validar ID en params
      PerfilController.eliminarPerfilAdmin
    );

    // Casilleros Asociados
    this.router.get(
      '/casilleros',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']), // Solo los clientes pueden acceder
      PerfilController.obtenerCasillerosAsociados
    );

    // Solicitudes Asociadas
    this.router.get(
      '/solicitudes',
      authenticateJWT,
      validateRole(['Cliente', 'Administrador']), // Solo los clientes pueden acceder
      validateRequest(SolicitudesQueryDto, 'query'), // Validar filtros y paginación
      PerfilController.obtenerSolicitudesAsociadas
    );
  }
}

export default new PerfilRoutes().router;