import { Request, Response, NextFunction } from 'express';
import SolicitudService from '@services/solicitud.service';

class SolicitudController {
    /**
     * Crear una solicitud.
     */
    public async crearSolicitud(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const solicitud = await SolicitudService.crearSolicitud(req.body);
            res.status(201).json({ message: 'Solicitud creada exitosamente.', solicitud });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Listar solicitudes.
     */
    public async listarSolicitudes(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const solicitudes = await SolicitudService.listarSolicitudes(req.query);
            res.status(200).json(solicitudes);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtener detalles de una solicitud.
     */
    public async obtenerSolicitud(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const solicitud = await SolicitudService.obtenerSolicitudPorId(req.params.id);
            if (!solicitud) {
                res.status(404).json({ message: 'Solicitud no encontrada.' });
            }
            res.status(200).json(solicitud);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Eliminar una solicitud.
     */
    public async eliminarSolicitud(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await SolicitudService.eliminarSolicitud(req.params.id);
            res.status(200).json({ message: 'Solicitud eliminada exitosamente.' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualizar el estado de una solicitud.
     */
    public async actualizarEstadoSolicitud(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await SolicitudService.actualizarEstadoSolicitud(req.body);
            res.status(200).json({ message: 'Estado de la solicitud actualizado exitosamente.' });
        } catch (error) {
            next(error);
        }
    }
}

export default new SolicitudController();
