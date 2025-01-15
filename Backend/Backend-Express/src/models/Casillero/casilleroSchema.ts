import { Schema } from 'mongoose';

const casilleroSchema = new Schema({
  numero: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  estado: {
    type: String,
    enum: ['disponible', 'ocupado'],
    default: 'disponible',
  },
  perfil: {
    type: Schema.Types.ObjectId,
    ref: 'Perfil',
    unique: true,
    index: true,
  },
}, { timestamps: true });

export default casilleroSchema;