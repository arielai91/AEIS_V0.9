import { Router } from 'express';
import SolicitudesController from '@controllers/solicitudes.controller';

class SolicitudRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', SolicitudesController.getSolicitud);
        // Puedes agregar más rutas aquí
    }
}

export default new SolicitudRoutes().router;