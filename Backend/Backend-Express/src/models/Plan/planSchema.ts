import { Schema } from 'mongoose';

const planSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    enum: ['Sin Plan', 'Pantera Junior', 'Pantera Senior'],
    index: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
    index: true,
  },
  duracion: {
    type: Number,
    default: 6,
  },
  beneficios: {
    type: [String],
    default: [],
  },
  esPorDefecto: {
    type: Boolean,
    default: false,
  },
  usuarios: [
    { type: Schema.Types.ObjectId, ref: 'Perfil' }
  ],
}, {
  timestamps: true,
});


export default planSchema;