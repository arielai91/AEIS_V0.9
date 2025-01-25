import { Request, Response, NextFunction } from 'express';
import SolicitudService from '@services/solicitud.service';
import logger from '@logger/logger';
import { CrearSolicitudDto } from '@dtos/solicitud.dto';
import { AuthenticatedRequest } from '@type/global';

class SolicitudController {
    /**
     * Crear una solicitud.
     */
    public async crearSolicitud(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const data: CrearSolicitudDto = req.body;
            const userId = req.user?.id;
            data.perfil = userId as string;
            await SolicitudService.crearSolicitud(data);

            res.status(201).json({ message: 'Solicitud creada exitosamente.', success: true });
        } catch (error) {
            logger.error('Error al crear solicitud:', error as Error);

            const err = error as Error; // Type assertion para indicar que error es de tipo Error

            if (err.message === 'Solicitud ya existe') {
                res.status(409).json({ message: 'Solicitud ya existe', success: false });
            } else {
                res.status(500).json({ message: 'Error interno del servidor', success: false });
            }
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
