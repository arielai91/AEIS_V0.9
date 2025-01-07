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
    unique: false,
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
  casillero: {
    type: Schema.Types.ObjectId,
    ref: 'casilleros',
    immutable: true,
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'plans',
    default: async function () {
      const planPorDefecto = await Plan.findOne({ esPorDefecto: true });
      return planPorDefecto ? planPorDefecto._id : null;
    },
  },
}, { timestamps: true });

export default perfilSchema;