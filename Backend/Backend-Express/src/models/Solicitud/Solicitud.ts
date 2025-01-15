import { Document, model, Schema } from 'mongoose';
import solicitudSchema from './solicitudSchema';

// Define la interfaz para el documento Solicitud
export interface ISolicitud extends Document {
    perfil: Schema.Types.ObjectId;
    tipo: 'Plan' | 'Casillero';
    plan?: Schema.Types.ObjectId;
    casillero?: Schema.Types.ObjectId;
    fechaEnvio: Date;
    fechaAprobacion?: Date;
    imagen?: string;
    estado: 'Aprobado' | 'Rechazado' | 'Por verificar';
}

// Define el modelo Solicitud usando el esquema y la interfaz
const SolicitudModel = model<ISolicitud>('Solicitud', solicitudSchema, 'solicitudes');
export default SolicitudModel;