import { Document, model } from 'mongoose';
import planSchema from './planSchema';

export interface IPlan extends Document {
  nombre: 'Sin Plan' | 'Pantera Junior' | 'Pantera Senior';
  precio: number;
  duracion: number;
  beneficios: string[];
  esPorDefecto: boolean;
}

const PlanModel = model<IPlan>('Plan', planSchema);
export default PlanModel;