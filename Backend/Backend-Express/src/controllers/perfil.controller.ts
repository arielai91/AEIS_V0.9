import { Request, Response } from 'express';
import PerfilService from '@services/perfil.service';
import logger from '@logger/logger';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

class PerfilController {
  /**
   * Crear un nuevo perfil.
   */
  public async crearPerfil(req: Request, res: Response): Promise<void> {
    try {
      const perfilCreado = await PerfilService.crearPerfil(req.body);
      res.status(201).json(perfilCreado);
    } catch (err) {
      logger.error('Error al crear perfil:', err as Error);
      res.status(400).json({ message: 'Error al crear perfil' });
    }
  }

  /**
   * Eliminar perfil.
   */
  public async eliminarPerfil(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(403).json({ message: 'Usuario no autenticado' });
        return;
      }

      await PerfilService.eliminarPerfil(userId);
      res.status(200).json({ message: 'Perfil eliminado exitosamente' });
    } catch (err) {
      logger.error('Error al eliminar perfil:', err as Error);
      res.status(500).json({ message: 'Error al eliminar perfil' });
    }
  }
}

export default new PerfilController();