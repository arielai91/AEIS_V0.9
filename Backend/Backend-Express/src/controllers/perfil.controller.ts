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
      const datosPerfil = req.body;
      datosPerfil.rol = 'Cliente'; // Asignar rol de usuario
      const perfilCreado = await PerfilService.crearPerfil(datosPerfil);
      res.status(201).json(perfilCreado);
    } catch (err) {
      logger.error('Error al crear Cliente:', err as Error);
      res.status(400).json({ message: 'Error al crear Cliente' });
    }
  }

  /**
   * Crear un nuevo perfil por un administrador.
   */
  public async crearPerfilAdmin(req: Request, res: Response): Promise<void> {
    try {
      const datosPerfil = req.body;
      datosPerfil.rol = 'Administrador'; // Asignar rol de administrador
      const perfilCreado = await PerfilService.crearPerfil(datosPerfil);
      res.status(201).json(perfilCreado);
    } catch (err) {
      logger.error('Error al crear Admin:', err as Error);
      res.status(400).json({ message: 'Error al crear Admin' });
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

  /**
   * Eliminar perfil por un administrador.
   */
  public async eliminarPerfilAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { perfilId } = req.body;

      if (!perfilId) {
        res.status(400).json({ message: 'Falta el ID del perfil' });
        return;
      }

      await PerfilService.eliminarPerfil(perfilId);
      res.status(200).json({ message: 'Perfil eliminado exitosamente por admin' });
    } catch (err) {
      logger.error('Error al eliminar perfil por admin:', err as Error);
      res.status(500).json({ message: 'Error al eliminar perfil por admin' });
    }
  }
}

export default new PerfilController();