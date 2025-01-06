import { Document, model, Schema } from 'mongoose';
import perfilSchema from '@models/Perfil/perfilSchema';

export interface IPerfil extends Document {
  rol: 'Administrador' | 'Cliente';
  nombreCompleto: string;
  email: string;
  cedula: string;
  contraseña: string;
  imagen?: string;
  casillero: Schema.Types.ObjectId;
  plan: Schema.Types.ObjectId;
}

const PerfilModel = model<IPerfil>('Perfil', perfilSchema);
export default PerfilModel;