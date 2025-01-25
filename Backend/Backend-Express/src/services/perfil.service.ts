import bcrypt from 'bcrypt';
import PerfilModel from '@models/Perfil/Perfil';
import CasilleroModel from '@models/Casillero/Casillero';
import SolicitudModel from '@models/Solicitud/Solicitud';
import PlanModel from '@models/Plan/Plan';
import { CrearPerfilDto, ActualizarPerfilDto, SolicitudesQueryDto } from '@dtos/perfil.dto';
import { IPerfil, ICasillero, ISolicitud } from '@type/global';
import { FilterQuery } from 'mongoose';

class PerfilService {
    /**
     * Crear un nuevo perfil.
     */
    public async crearPerfil(data: CrearPerfilDto): Promise<IPerfil> {
        const { email, cedula } = data;

        const perfilExistente = await PerfilModel.findOne({ $or: [{ email }, { cedula }] });
        if (perfilExistente) {
            throw new Error('Perfil ya existe');
        }

        if (!data.plan) {
            const planPorDefecto = await PlanModel.findOne({ esPorDefecto: true });
            if (planPorDefecto) {
                data.plan = planPorDefecto._id as string;
            } else {
                throw new Error('No se encontró un plan por defecto.');
            }
        }

        const salt = await bcrypt.genSalt(10);
        data.contraseña = await bcrypt.hash(data.contraseña, salt);

        const nuevoPerfil = new PerfilModel(data);
        return await nuevoPerfil.save();
    }

    /**
     * Obtener un perfil por ID.
     */
    public async obtenerPerfilPorId(id: string): Promise<IPerfil | null> {
        return await PerfilModel.findById(id).populate('casilleros plan solicitudes').exec();
    }

    /**
     * Actualizar un perfil.
     */
    public async actualizarPerfil(id: string, data: ActualizarPerfilDto): Promise<IPerfil | null> {
        return await PerfilModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
    }

    /**
     * Eliminar un perfil.
     */
    public async eliminarPerfil(id: string): Promise<void> {
        // Eliminar casilleros asociados
        await CasilleroModel.updateMany({ perfil: id }, { perfil: null, estado: 'disponible' }).exec();

        // Eliminar solicitudes asociadas
        await SolicitudModel.deleteMany({ perfil: id }).exec();

        // Eliminar el perfil
        await PerfilModel.findByIdAndDelete(id).exec();
    }

    /**
     * Obtener los casilleros asociados a un perfil.
     */
    public async obtenerCasillerosAsociados(id: string): Promise<ICasillero[]> {
        const casilleros = await CasilleroModel.find({ perfil: id }).exec();
        if (casilleros.length === 0) {
            throw new Error('No existen casilleros asociados a este perfil.');
        }
        return casilleros;
    }

    /**
     * Obtener las solicitudes asociadas a un perfil.
     */
    public async obtenerSolicitudesAsociadas(id: string, query: SolicitudesQueryDto): Promise<ISolicitud[]> {
        const { estado, page = 1, limit = 10 } = query;

        const pageNumber = parseInt(page as unknown as string, 10);
        const limitNumber = parseInt(limit as unknown as string, 10);

        const filtro: FilterQuery<ISolicitud> = { perfil: id };
        if (estado) filtro.estado = estado;

        const solicitudes = await SolicitudModel.find(filtro)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .exec();

        if (solicitudes.length === 0) {
            throw new Error('No existen solicitudes asociadas a este perfil.');
        }

        return solicitudes;
    }

    /**
     * Subir imagen de perfil.
     * Aquí podrías integrar un servicio de almacenamiento como S3.
     */
    public async subirImagenPerfil(cedula: string, imagePath: string): Promise<void> {
        const perfil = await PerfilModel.findOne({ cedula }).exec();
        if (!perfil) {
            throw new Error('Perfil no encontrado');
        }
        await PerfilModel.findByIdAndUpdate(perfil._id, { imagen: imagePath }).exec();
    }

    /**
     * Actualizar imagen de perfil.
     */
    public async actualizarImagenPerfil(id: string, newImagePath: string): Promise<void> {
        await PerfilModel.findByIdAndUpdate(id, { imagen: newImagePath }).exec();
    }

    /**
     * Eliminar imagen de perfil.
     */
    public async eliminarImagenPerfil(id: string): Promise<void> {
        await PerfilModel.findByIdAndUpdate(id, { imagen: null }).exec();
    }
}

export default new PerfilService();