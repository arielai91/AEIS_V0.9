import { Schema } from 'mongoose';

export interface IPerfil {
  rol: 'Administrador' | 'Cliente';
  nombreCompleto: string;
  email: string;
  cedula: string;
  contraseña: string;
  imagen?: string;
  casilleros: Schema.Types.ObjectId[];
  plan: Schema.Types.ObjectId;
  solicitudes: Schema.Types.ObjectId[];
}

export interface IPlan {
  nombre: 'Sin Plan' | 'Pantera Junior' | 'Pantera Senior';
  precio: number;
  duracion: number;
  beneficios: string[];
  esPorDefecto: boolean;
  usuarios: Schema.Types.ObjectId[];
}

export interface ICasillero {
  numero: number;
  estado: 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento';
  perfil: Schema.Types.ObjectId;
}

export interface ISolicitud {
  perfil: Schema.Types.ObjectId;
  tipo: 'Plan' | 'Casillero';
  plan?: Schema.Types.ObjectId;
  casillero?: Schema.Types.ObjectId;
  fechaEnvio: Date;
  fechaAprobacion?: Date;
  imagen: string;
  estado: 'Aprobado' | 'Rechazado' | 'Por verificar';
}