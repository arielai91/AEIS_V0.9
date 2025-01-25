import SolicitudModel from '@models/Solicitud/Solicitud';
import PerfilModel from '@models/Perfil/Perfil';
import CasilleroModel from '@models/Casillero/Casillero';
import PlanModel from '@models/Plan/Plan';
import { CrearSolicitudDto, ActualizarEstadoSolicitudDto, ListarSolicitudesQueryDto } from '@dtos/solicitud.dto';
import { ISolicitud } from '@type/global';
import { FilterQuery, Schema } from 'mongoose';

class SolicitudService {
    /**
     * Crear una nueva solicitud.
     */
    public async crearSolicitud(data: CrearSolicitudDto): Promise<ISolicitud> {
        const { perfil, tipo, plan, casillero, imagen } = data;

        // Verificar la existencia del perfil
        const perfilExistente = await PerfilModel.findById(perfil).exec();
        if (!perfilExistente) {
            throw new Error('El perfil especificado no existe.');
        }

        // Validar la relación según el tipo de solicitud
        if (tipo === 'Plan' && plan) {
            const planExistente = await PlanModel.findById(plan).exec();
            if (!planExistente) {
                throw new Error('El plan especificado no existe.');
            }
        } else if (tipo === 'Casillero' && casillero) {
            const casilleroExistente = await CasilleroModel.findById(casillero).exec();
            if (!casilleroExistente) {
                throw new Error('El casillero especificado no existe.');
            }
        }

        // Crear la solicitud
        const nuevaSolicitud = new SolicitudModel({
            perfil,
            tipo,
            plan: tipo === 'Plan' ? plan : undefined,
            casillero: tipo === 'Casillero' ? casillero : undefined,
            imagen,
        });
        const solicitudGuardada = await nuevaSolicitud.save();

        perfilExistente.solicitudes.push(solicitudGuardada._id as Schema.Types.ObjectId);
        await perfilExistente.save();

        return solicitudGuardada;
    }

    /**
     * Listar solicitudes con filtros y paginación.
     */
    public async listarSolicitudes(filtros: ListarSolicitudesQueryDto): Promise<ISolicitud[]> {
        const { estado, perfil, tipo, page = 1, limit = 10 } = filtros;

        const query: FilterQuery<ISolicitud> = {};

        if (estado) {
            query.estado = estado;
        }
        if (perfil) {
            query.perfil = perfil;
        }
        if (tipo) {
            query.tipo = tipo;
        }

        return await SolicitudModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('perfil plan casillero')
            .exec();
    }
    /**
     * Obtener una solicitud por ID.
     */
    public async obtenerSolicitudPorId(id: string): Promise<ISolicitud | null> {
        return await SolicitudModel.findById(id).populate('perfil plan casillero').exec();
    }

    /**
     * Eliminar una solicitud por ID.
     */
    public async eliminarSolicitud(id: string): Promise<void> {
        const solicitud = await SolicitudModel.findByIdAndDelete(id).exec();
        if (!solicitud) {
            throw new Error('La solicitud especificada no existe.');
        }

        const perfil = await PerfilModel.findById(solicitud.perfil).exec();
        if (perfil) {
            perfil.solicitudes = perfil.solicitudes.filter((s: Schema.Types.ObjectId) => s.toString() !== id);
            await perfil.save();
        }
    }

    /**
     * Actualizar el estado de una solicitud.
     */
    public async actualizarEstadoSolicitud(data: ActualizarEstadoSolicitudDto): Promise<void> {
        const { id, estado } = data;

        const solicitud = await SolicitudModel.findById(id).exec();
        if (!solicitud) {
            throw new Error('La solicitud especificada no existe.');
        }

        solicitud.estado = estado;
        solicitud.fechaAprobacion = estado === 'Aprobado' ? new Date() : null;
        await solicitud.save();

        if (estado === 'Aprobado') {
            if (solicitud.tipo === 'Casillero') {
                const casillero = await CasilleroModel.findById(solicitud.casillero).exec();
                const perfil = await PerfilModel.findById(solicitud.perfil).exec();
                if (casillero && perfil) {
                    casillero.estado = 'ocupado';
                    casillero.perfil = solicitud.perfil;
                    await casillero.save();

                    perfil.casilleros.push(casillero._id as Schema.Types.ObjectId);
                    await perfil.save();
                }
            } else if (solicitud.tipo === 'Plan') {
                const plan = await PlanModel.findById(solicitud.plan).exec();
                const perfil = await PerfilModel.findById(solicitud.perfil).exec();
                if (plan && perfil) {
                    perfil.plan = plan._id as Schema.Types.ObjectId;
                    await perfil.save();

                    plan.usuarios.push(perfil._id);
                    await plan.save();
                }
            }
        }
    }
}

export default new SolicitudService();