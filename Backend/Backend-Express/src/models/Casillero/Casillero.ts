import { Document, model, Schema } from 'mongoose';
import casilleroSchema from '@models/Casillero/casilleroSchema';

export interface ICasillero extends Document {
  numero: number;
  estado: 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento';
  perfil: Schema.Types.ObjectId | null;
}

const CasilleroModel = model<ICasillero>('Casillero', casilleroSchema, 'casilleros');
export default CasilleroModel;