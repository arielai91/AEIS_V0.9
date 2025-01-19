import { Request, Response } from 'express';
import SolicitudService from '@services/solicitud.service';
import logger from '@logger/logger';
import { CrearSolicitudDto, EliminarSolicitudDto } from '@dtos/solicitud.dto';

class SolicitudesController {
    /**
     * Crear una nueva solicitud.
     */
    public async crearSolicitud(req: Request, res: Response): Promise<void> {
        try {
            const datosSolicitud: CrearSolicitudDto = req.body;
            const solicitudCreada = await SolicitudService.crearSolicitud(datosSolicitud);
            res.status(201).json(solicitudCreada);
        } catch (err) {
            logger.error('Error al crear solicitud:', err as Error);
            res.status(400).json({ message: 'Error al crear solicitud' });
        }
    }

    /**
     * Eliminar una solicitud.
     */
    public async eliminarSolicitud(req: Request, res: Response): Promise<void> {
        try {
            const { solicitudId }: EliminarSolicitudDto = req.body;

            if (!solicitudId) {
                res.status(400).json({ message: 'Falta el ID de la solicitud' });
                return;
            }

            await SolicitudService.eliminarSolicitud(solicitudId);
            res.status(200).json({ message: 'Solicitud eliminada exitosamente' });
        } catch (err) {
            logger.error('Error al eliminar solicitud:', err as Error);
            res.status(500).json({ message: 'Error al eliminar solicitud' });
        }
    }
}

export default new SolicitudesController();