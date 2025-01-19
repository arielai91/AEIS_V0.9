import { Router } from 'express';
import SolicitudesController from '@controllers/solicitudes.controller';
import authenticateJWT from '@middlewares/auth.middleware';
import validateRole from '@middlewares/rol-auth.middleware';
import validateRequest from '@middlewares/validateRequest.middleware';
import { CrearSolicitudDto, EliminarSolicitudDto } from '@dtos/solicitud.dto';
import validateCsrfToken from '@middlewares/csrf.middleware';

class SolicitudRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Ruta para que los usuarios creen solicitudes
        this.router.post('/', authenticateJWT, validateRole(['Usuario']), validateRequest(CrearSolicitudDto), validateCsrfToken, SolicitudesController.crearSolicitud);

        // Ruta para que los administradores eliminen solicitudes
        this.router.delete('/', authenticateJWT, validateRole(['Administrador']), validateRequest(EliminarSolicitudDto), validateCsrfToken, SolicitudesController.eliminarSolicitud);
    }
}

export default new SolicitudRoutes().router;