import { Schema, Document } from 'mongoose';
import { Request } from 'express';
export interface IPerfil {
  rol: 'Administrador' | 'Cliente';
  nombreCompleto: string;
  email: string;
  cedula: string;
  contraseña: string;
  imagen?: string;
  casilleros: Schema.Types.ObjectId[];
  plan: Schema.Types.ObjectId | null;
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
  perfil: Schema.Types.ObjectId | null;
}

export interface ISolicitud extends Document {
  perfil: Schema.Types.ObjectId;
  tipo: 'Plan' | 'Casillero';
  plan?: Schema.Types.ObjectId;
  casillero?: Schema.Types.ObjectId;
  fechaEnvio: Date;
  fechaAprobacion?: Date | null;
  imagen: string;
  estado: 'Aprobado' | 'Rechazado' | 'Por verificar';
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // Solo el ID del usuario autenticado
  };
}

interface UserProfileRedis {
  id: string;
  nombreCompleto: string;
  email: string;
  rol: string;
}

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  rol: string | undefined;
}
