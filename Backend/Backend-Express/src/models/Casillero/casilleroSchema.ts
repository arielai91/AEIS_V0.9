import { Schema } from 'mongoose';

const casilleroSchema = new Schema({
  numero: {
    type: Number,
    required: true,
    unique: true,
    index: true,
    inmutable: true,
    min: [1, 'El número del casillero debe ser positivo.'],
  },
  estado: {
    type: String,
    enum: ['disponible', 'ocupado', 'reservado', 'mantenimiento'],
    default: 'disponible',
  },
  perfil: {
    type: Schema.Types.ObjectId,
    ref: 'Perfil',
    index: true,
    default: null,
  },
}, { timestamps: true });

export default casilleroSchema;