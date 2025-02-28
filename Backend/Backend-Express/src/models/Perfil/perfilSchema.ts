import { Schema } from 'mongoose';
import Plan from '@models/Plan/Plan';

const perfilSchema = new Schema({
  rol: {
    type: String,
    required: true,
    enum: ['Administrador', 'Cliente'],
    immutable: true,
  },
  nombreCompleto: {
    type: String,
    required: true,
    maxlength: 30,
    immutable: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w.-]+@epn\.edu\.ec$/,
    immutable: true,
    index: true,
  },
  cedula: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/,
    immutable: true,
    index: true,
  },
  contraseña: {
    type: String,
    required: true,
    select: false,
  },
  imagen: {
    type: String,
    default: null,
  },
  casilleros: [
    { type: Schema.Types.ObjectId, ref: 'Casillero' }
  ],
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    default: async function () {
      const planPorDefecto = await Plan.findOne({ esPorDefecto: true });
      return planPorDefecto ? planPorDefecto._id : null;
    },
  },
  solicitudes: [
    { type: Schema.Types.ObjectId, ref: 'Solicitud' }
  ],
}, { timestamps: true });

export default perfilSchema;