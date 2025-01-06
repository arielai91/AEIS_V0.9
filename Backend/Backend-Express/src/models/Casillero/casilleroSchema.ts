import { Schema } from 'mongoose';

const casilleroSchema = new Schema({
  numero: {
    type: Number,
    required: true,
    unique: true,
  },
  estado: {
    type: String,
    enum: ['disponible', 'ocupado'],
    default: 'disponible',
  },
  perfil: {
    type: Schema.Types.ObjectId,
    ref: 'perfils',
  },
}, { timestamps: true });

casilleroSchema.index({ numero: 1 }, { unique: true, background: true });
casilleroSchema.index({ perfil: 1 }, { background: true });

export default casilleroSchema;