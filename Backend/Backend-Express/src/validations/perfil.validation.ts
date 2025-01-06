import { Request, Response, NextFunction } from 'express';
import PerfilModel from '@models/Perfil/Perfil';

export const validatePerfilExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const perfil = await PerfilModel.findById(id);

  if (!perfil) {
    res.status(404).json({ message: 'Perfil not found' });
    return;
  }

  next();
};