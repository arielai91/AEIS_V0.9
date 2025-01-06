import { Schema } from 'mongoose';

export interface IPerfil {
  rol: 'Administrador' | 'Cliente';
  nombreCompleto: string;
  email: string;
  cedula: string;
  contraseña: string;
  imagen?: string;
  casillero: Schema.Types.ObjectId;
  plan: Schema.Types.ObjectId;
}

export interface IPlan {
  nombre: 'Sin Plan' | 'Pantera Junior' | 'Pantera Senior';
  precio: number;
  duracion: number;
  beneficios: string[];
  esPorDefecto: boolean;
}

export interface ICasillero {
  numero: number;
  estado: 'disponible' | 'ocupado';
  perfil: Schema.Types.ObjectId;
}