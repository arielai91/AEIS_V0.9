import SolicitudModel from '@models/Solicitud/Solicitud';
import { CrearSolicitudDto } from '@dtos/solicitud.dto';
import { Types } from 'mongoose';
import { ISolicitud } from '@type/global';

interface User {
    id: string;
    role: string;
}

class SolicitudesService {
    // Crear una solicitud
    public async crearSolicitud(datosSolicitud: CrearSolicitudDto): Promise<ISolicitud> {
        const solicitud = await SolicitudModel.create({
            perfil: new Types.ObjectId(datosSolicitud.perfil),
            tipo: datosSolicitud.tipo,
            plan: datosSolicitud.plan ? new Types.ObjectId(datosSolicitud.plan) : undefined,
            casillero: datosSolicitud.casillero ? new Types.ObjectId(datosSolicitud.casillero) : undefined,
            imagen: datosSolicitud.imagen,
        });
        return solicitud.toObject();
    }

    // Eliminar una solicitud
    public async eliminarSolicitud(solicitudId: string): Promise<void> {
        const solicitud = await SolicitudModel.findById(solicitudId);
        if (!solicitud) {
            throw new Error('Solicitud no encontrada.');
        }
        await solicitud.deleteOne();
    }

    // Listar solicitudes con filtros y acceso por rol
    public async listarSolicitudes(filtros: { tipo?: string; estado?: string; }, user: { id: string; role: string; }): Promise<ISolicitud[]> {
        const query: Record<string, unknown> = {};

        if (filtros.tipo) {
            query.tipo = filtros.tipo;
        }
        if (filtros.estado) {
            query.estado = filtros.estado;
        }

        // Filtrar solicitudes por usuario si no es administrador
        if (user.role !== 'Administrador') {
            query.perfil = new Types.ObjectId(user.id);
        }

        return await SolicitudModel.find(query).exec();
    }

    // Actualizar estado de una solicitud
    public async actualizarEstadoSolicitud(solicitudId: string, estado: 'Aprobado' | 'Rechazado' | 'Por verificar'): Promise<ISolicitud> {
        const solicitud = await SolicitudModel.findById(solicitudId);
        if (!solicitud) {
            throw new Error('Solicitud no encontrada.');
        }
        solicitud.estado = estado;
        if (estado === 'Aprobado' || estado === 'Rechazado') {
            solicitud.fechaAprobacion = new Date();
        }
        return await solicitud.save();
    }

    // Obtener detalles de una solicitud
    public async obtenerSolicitud(id: string, user: User): Promise<ISolicitud> {
        const solicitud = await SolicitudModel.findById(id).populate(['perfil', 'plan', 'casillero']);
        if (!solicitud) {
            throw new Error('Solicitud no encontrada.');
        }
        if (user.role !== 'Administrador' && solicitud.perfil.toString() !== user.id) {
            throw new Error('No tienes permiso para ver esta solicitud.');
        }
        return solicitud.toObject();
    }
}

export default new SolicitudesService();