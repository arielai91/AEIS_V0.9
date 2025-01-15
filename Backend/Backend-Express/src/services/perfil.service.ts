import { Types } from 'mongoose';
import PerfilModel from '@models/Perfil/Perfil';
import { IPerfil } from '@type/global';

class PerfilService {
    // Crear un nuevo perfil
    public async createPerfil(data: Partial<IPerfil>): Promise<IPerfil> {
        const perfil = new PerfilModel(data);
        return await perfil.save();
    }

    // Obtener un perfil por ID
    public async getPerfilById(id: Types.ObjectId): Promise<IPerfil | null> {
        return await PerfilModel.findById(id).populate('casilleros').populate('plan').populate('solicitudes').exec();
    }

    // Obtener todos los perfiles
    public async getAllPerfiles(): Promise<IPerfil[]> {
        return await PerfilModel.find().populate('casilleros').populate('plan').populate('solicitudes').exec();
    }

    // Actualizar un perfil por ID
    public async updatePerfil(id: Types.ObjectId, data: Partial<IPerfil>): Promise<IPerfil | null> {
        return await PerfilModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    // Eliminar un perfil por ID
    public async deletePerfil(id: Types.ObjectId): Promise<IPerfil | null> {
        return await PerfilModel.findByIdAndDelete(id).exec();
    }
}

export default new PerfilService();