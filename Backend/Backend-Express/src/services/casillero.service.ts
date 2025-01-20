import CasilleroModel from '@models/Casillero/Casillero';
import PerfilModel from '@models/Perfil/Perfil';
import { CrearCasilleroDto, ActualizarEstadoDto, AsignarCasilleroDto, LiberarCasilleroDto, FiltroCasillerosQueryDto } from '@dtos/casillero.dto';
import { ICasillero } from '@type/global';
import { FilterQuery, Schema } from 'mongoose';

class CasilleroService {
    /**
     * Crear un nuevo casillero.
     */
    public async crearCasillero(data: CrearCasilleroDto): Promise<ICasillero> {
        const nuevoCasillero = new CasilleroModel(data);
        return await nuevoCasillero.save();
    }

    /**
     * Obtener todos los casilleros con filtros.
     */
    public async obtenerCasilleros(filtros: FiltroCasillerosQueryDto): Promise<ICasillero[]> {
        const { estado, page = 1, limit = 10 } = filtros;
        const query: FilterQuery<ICasillero> = {};

        if (estado) {
            query.estado = estado;
        }

        return await CasilleroModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    /**
     * Obtener un casillero por ID.
     */
    public async obtenerCasilleroPorId(id: string): Promise<ICasillero | null> {
        return await CasilleroModel.findById(id).exec();
    }

    /**
     * Eliminar un casillero.
     */
    public async eliminarCasillero(id: string): Promise<void> {
        await CasilleroModel.findByIdAndDelete(id).exec();
    }

    /**
     * Asignar un casillero a un perfil.
     */
    public async asignarCasillero(data: AsignarCasilleroDto): Promise<void> {
        const { casilleroId, perfilId } = data;

        const casillero = await CasilleroModel.findById(casilleroId).exec();
        if (!casillero || casillero.estado !== 'disponible') {
            throw new Error('El casillero no está disponible para asignación.');
        }

        const perfil = await PerfilModel.findById(perfilId).exec();
        if (!perfil) {
            throw new Error('El perfil especificado no existe.');
        }

        casillero.perfil = new Schema.Types.ObjectId(perfilId);
        casillero.estado = 'ocupado';
        await casillero.save();
    }

    /**
     * Liberar un casillero.
     */
    public async liberarCasillero(data: LiberarCasilleroDto): Promise<void> {
        const { casilleroId } = data;

        const casillero = await CasilleroModel.findById(casilleroId).exec();
        if (!casillero || !casillero.perfil) {
            throw new Error('El casillero no está asignado a ningún perfil.');
        }

        casillero.perfil = null;
        casillero.estado = 'disponible';
        await casillero.save();
    }

    /**
     * Actualizar el estado de un casillero.
     */
    public async actualizarEstado(data: ActualizarEstadoDto): Promise<void> {
        const { casilleroId, estado } = data;

        const casillero = await CasilleroModel.findById(casilleroId).exec();
        if (!casillero) {
            throw new Error('El casillero especificado no existe.');
        }

        casillero.estado = estado;
        await casillero.save();
    }
}

export default new CasilleroService();
