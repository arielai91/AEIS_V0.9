import { Types, ObjectId } from 'mongoose';
import CasilleroModel from '@models/Casillero/Casillero';
import PerfilModel from '@models/Perfil/Perfil';
import { CrearCasilleroDto } from '@dtos/casillero.dto';
import { ICasillero } from '@type/global';

class CasilleroService {
    public async crearCasillero(datosCasillero: CrearCasilleroDto): Promise<ICasillero> {
        const existe = await CasilleroModel.findOne({ numero: datosCasillero.numero });
        if (existe) {
            throw new Error(`El casillero con número ${datosCasillero.numero} ya existe.`);
        }

        const casillero = await CasilleroModel.create({
            numero: datosCasillero.numero,
        });

        return casillero.toObject();
    }

    public async eliminarCasillero(casilleroId: string): Promise<void> {
        const casillero = await CasilleroModel.findById(casilleroId);

        if (!casillero) {
            throw new Error('Casillero no encontrado.');
        }

        if (casillero.perfil) {
            throw new Error('No se puede eliminar un casillero asignado.');
        }

        await casillero.deleteOne();
    }

    public async asignarPerfil(casilleroId: string, perfilId: string): Promise<ICasillero> {
        const casillero = await CasilleroModel.findById(casilleroId);
        if (!casillero) {
            throw new Error('Casillero no encontrado.');
        }

        if (casillero.estado !== 'disponible') {
            throw new Error('El casillero no está disponible.');
        }

        const perfilExiste = await PerfilModel.findById(perfilId);
        if (!perfilExiste) {
            throw new Error('Perfil no encontrado.');
        }

        casillero.perfil = perfilId as unknown as ObjectId;
        casillero.estado = 'ocupado';

        return await casillero.save();
    }

    public async liberarCasillero(casilleroId: string): Promise<ICasillero> {
        const casillero = await CasilleroModel.findById(casilleroId);
        if (!casillero) {
            throw new Error('Casillero no encontrado.');
        }

        if (!casillero.perfil) {
            throw new Error('El casillero no tiene un perfil asignado.');
        }

        casillero.perfil = null as unknown as ObjectId;
        casillero.estado = 'disponible';

        return await casillero.save();
    }

    public async actualizarEstado(casilleroId: string, estado: 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento'): Promise<ICasillero> {
        const casillero = await CasilleroModel.findById(casilleroId);
        if (!casillero) {
            throw new Error('Casillero no encontrado.');
        }

        casillero.estado = estado;

        if (estado === 'disponible') {
            casillero.perfil = null as unknown as ObjectId;
        }

        return await casillero.save();
    }

    public async obtenerCasilleros(filtros: { estado?: string; perfilId?: string; numero?: string }): Promise<ICasillero[]> {
        const query: Record<string, unknown> = {};

        if (filtros.estado) {
            query.estado = filtros.estado;
        }

        if (filtros.perfilId) {
            query.perfil = new Types.ObjectId(filtros.perfilId);
        }

        if (filtros.numero) {
            query.numero = parseInt(filtros.numero, 10);
        }

        return await CasilleroModel.find(query).exec();
    }
}

export default new CasilleroService();