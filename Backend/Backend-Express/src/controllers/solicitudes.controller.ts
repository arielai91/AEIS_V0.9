import { Request, Response } from 'express';
import SolicitudesService from '@services/solicitud.service';
import logger from '@logger/logger';

interface CustomRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

class SolicitudesController {
    // Crear una solicitud
    public async crearSolicitud(req: CustomRequest, res: Response): Promise<void> {
        try {
            const solicitud = await SolicitudesService.crearSolicitud(req.body);
            res.status(201).json({
                success: true,
                message: 'Solicitud creada exitosamente.',
                data: solicitud,
            });
        } catch (error) {
            logger.error('Error al crear solicitud:', error as Error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al crear solicitud.',
            });
        }
    }

    // Eliminar una solicitud
    public async eliminarSolicitud(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { solicitudId } = req.body;
            await SolicitudesService.eliminarSolicitud(solicitudId);
            res.status(200).json({
                success: true,
                message: 'Solicitud eliminada exitosamente.',
            });
        } catch (error) {
            logger.error('Error al eliminar solicitud:', error as Error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al eliminar solicitud.',
            });
        }
    }

    // Listar solicitudes
    public async listarSolicitudes(req: CustomRequest, res: Response): Promise<void> {
        try {
            const solicitudes = await SolicitudesService.listarSolicitudes(req.query, req.user!);
            res.status(200).json({
                success: true,
                message: 'Solicitudes obtenidas exitosamente.',
                data: solicitudes,
            });
        } catch (error) {
            logger.error('Error al listar solicitudes:', error as Error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al listar solicitudes.',
            });
        }
    }

    // Actualizar estado de una solicitud
    public async actualizarEstadoSolicitud(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { solicitudId, estado } = req.body;
            const solicitudActualizada = await SolicitudesService.actualizarEstadoSolicitud(solicitudId, estado);
            res.status(200).json({
                success: true,
                message: 'Estado de la solicitud actualizado exitosamente.',
                data: solicitudActualizada,
            });
        } catch (error) {
            logger.error('Error al actualizar estado de solicitud:', error as Error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al actualizar estado de solicitud.',
            });
        }
    }

    // Obtener detalles de una solicitud
    public async obtenerSolicitud(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const solicitud = await SolicitudesService.obtenerSolicitud(id, req.user!);
            res.status(200).json({
                success: true,
                message: 'Detalles de la solicitud obtenidos exitosamente.',
                data: solicitud,
            });
        } catch (error) {
            logger.error('Error al obtener detalles de la solicitud:', error as Error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error al obtener detalles de la solicitud.',
            });
        }
    }
}

export default new SolicitudesController();