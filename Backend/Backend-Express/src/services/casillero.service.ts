import CasilleroModel, { ICasillero } from '@models/Casillero/Casillero';

interface CreateCasilleroInput {
  numero: number;
  estado?: 'disponible' | 'ocupado';
  perfil?: string;
}

export const createCasillero = async (input: CreateCasilleroInput): Promise<ICasillero> => {
  const casillero = new CasilleroModel(input);
  await casillero.save();
  return casillero;
};