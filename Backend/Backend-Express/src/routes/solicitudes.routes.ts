import { Router } from 'express';
import SolicitudController from '@controllers/solicitudes.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateCsrfToken from '@middlewares/csrf.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import {
    CrearSolicitudDto,
    ActualizarEstadoSolicitudDto,
    ListarSolicitudesQueryDto,
    SolicitudIdDto,
    CsrfTokenDto,
} from '@dtos/solicitud.dto';
import validateRole from '@middlewares/rol-auth.middleware';

class SolicitudRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Crear una solicitud
        this.router.post(
            '/',
            authenticateJWT,
            validateRole(['Cliente', 'Administrador']),
            validateRequest(CsrfTokenDto, 'headers'),
            validateCsrfToken,
            validateRequest(CrearSolicitudDto, 'body'),
            SolicitudController.crearSolicitud
        );

        // Obtener todas las solicitudes con filtros
        this.router.get(
            '/',
            authenticateJWT,
            validateRole(['Administrador']),
            validateRequest(ListarSolicitudesQueryDto, 'query'),
            SolicitudController.listarSolicitudes
        );

        // Actualizar el estado de una solicitud
        this.router.patch(
            '/estado',
            authenticateJWT,
            validateRole(['Administrador']),
            validateCsrfToken,
            validateRequest(ActualizarEstadoSolicitudDto, 'body'),
            validateRequest(CsrfTokenDto, 'headers'),
            SolicitudController.actualizarEstadoSolicitud
        );

        // Eliminar una solicitud por ID
        this.router.delete(
            '/:id',
            authenticateJWT,
            validateRole(['Administrador']),
            validateCsrfToken,
            validateRequest(SolicitudIdDto, 'params'),
            validateRequest(CsrfTokenDto, 'headers'),
            SolicitudController.eliminarSolicitud
        );
    }
}

export default new SolicitudRoutes().router;
