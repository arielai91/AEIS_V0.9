import { Document, model, Schema } from 'mongoose';
import planSchema from './planSchema';

export interface IPlan extends Document {
  nombre: 'Sin Plan' | 'Pantera Junior' | 'Pantera Senior';
  precio: number;
  duracion: number;
  beneficios: string[];
  esPorDefecto: boolean;
  usuarios: Schema.Types.ObjectId[];
}

const PlanModel = model<IPlan>('Plan', planSchema);
export default PlanModel;