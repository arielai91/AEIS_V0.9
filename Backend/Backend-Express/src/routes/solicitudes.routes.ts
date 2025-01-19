import { Router } from 'express';
import SolicitudesController from '@controllers/solicitudes.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRole from '@middlewares/rol-auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import {
    CrearSolicitudDto,
    EliminarSolicitudDto,
    ListarSolicitudesQueryDto,
    ActualizarEstadoSolicitudDto,
    ObtenerSolicitudParamsDto,
} from '@dtos/solicitud.dto';
import validateCsrfToken from '@middlewares/csrf.middleware';

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
            validateRole(['Usuario']),
            validateRequest(CrearSolicitudDto, 'body'),
            validateCsrfToken,
            SolicitudesController.crearSolicitud,
        );

        // Eliminar una solicitud
        this.router.delete(
            '/',
            authenticateJWT,
            validateRole(['Administrador']),
            validateRequest(EliminarSolicitudDto, 'body'),
            validateCsrfToken,
            SolicitudesController.eliminarSolicitud,
        );

        // Listar solicitudes
        this.router.get(
            '/',
            authenticateJWT,
            validateRole(['Administrador', 'Usuario']),
            validateRequest(ListarSolicitudesQueryDto, 'query'),
            SolicitudesController.listarSolicitudes,
        );

        // Actualizar estado de una solicitud
        this.router.patch(
            '/estado',
            authenticateJWT,
            validateRole(['Administrador']),
            validateRequest(ActualizarEstadoSolicitudDto, 'body'),
            validateCsrfToken,
            SolicitudesController.actualizarEstadoSolicitud,
        );

        // Obtener detalles de una solicitud
        this.router.get(
            '/:id',
            authenticateJWT,
            validateRole(['Administrador', 'Usuario']),
            validateRequest(ObtenerSolicitudParamsDto, 'params'),
            SolicitudesController.obtenerSolicitud,
        );
    }
}

export default new SolicitudRoutes().router;