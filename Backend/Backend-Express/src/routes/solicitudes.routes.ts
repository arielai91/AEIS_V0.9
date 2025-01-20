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
            validateCsrfToken,
            validateRequest(CrearSolicitudDto, 'body'),
            validateRequest(CsrfTokenDto, 'headers'),
            SolicitudController.crearSolicitud
        );

        // Obtener todas las solicitudes con filtros
        this.router.get(
            '/',
            authenticateJWT,
            validateRequest(ListarSolicitudesQueryDto, 'query'),
            SolicitudController.listarSolicitudes
        );

        // Actualizar el estado de una solicitud
        this.router.patch(
            '/estado',
            authenticateJWT,
            validateCsrfToken,
            validateRequest(ActualizarEstadoSolicitudDto, 'body'),
            validateRequest(CsrfTokenDto, 'headers'),
            SolicitudController.actualizarEstadoSolicitud
        );

        // Eliminar una solicitud por ID
        this.router.delete(
            '/:id',
            authenticateJWT,
            validateCsrfToken,
            validateRequest(SolicitudIdDto, 'params'),
            validateRequest(CsrfTokenDto, 'headers'),
            SolicitudController.eliminarSolicitud
        );
    }
}

export default new SolicitudRoutes().router;
