import PerfilModel from '@models/Perfil/Perfil';
import { IPerfil } from '@type/global';
import { CreatePerfilDto, UpdatePerfilDto } from '@dtos/perfil.dto';

class PerfilService {
  public async createPerfil(data: CreatePerfilDto): Promise<IPerfil> {
    const perfil = new PerfilModel(data);
    return await perfil.save();
  }

  public async getPerfilById(id: string): Promise<IPerfil | null> {
    return await PerfilModel.findById(id).exec();
  }

  public async updatePerfil(id: string, data: UpdatePerfilDto): Promise<IPerfil | null> {
    return await PerfilModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  public async deletePerfil(id: string): Promise<IPerfil | null> {
    return await PerfilModel.findByIdAndDelete(id).exec();
  }
}

export default new PerfilService();