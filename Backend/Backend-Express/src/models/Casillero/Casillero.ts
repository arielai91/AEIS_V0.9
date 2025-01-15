import { Document, model, Schema } from 'mongoose';
import casilleroSchema from './casilleroSchema';

export interface ICasillero extends Document {
  numero: number;
  estado: 'disponible' | 'ocupado';
  perfil: Schema.Types.ObjectId;
}

const CasilleroModel = model<ICasillero>('Casillero', casilleroSchema, 'casilleros');
export default CasilleroModel;