import { Request, Response, NextFunction } from 'express';
import PerfilService from '@services/perfil.service';
import { CrearPerfilDto, ActualizarPerfilDto } from '@dtos/perfil.dto';
import logger from '@logger/logger';
import { AuthenticatedRequest } from '@type/global';

class PerfilController {
  public async crearPerfil(req: Request, res: Response): Promise<void> {
    try {
      const data: CrearPerfilDto = req.body;
      data.rol = 'Cliente';
      const perfil = await PerfilService.crearPerfil(data);
      await PerfilService.subirImagenPerfil(perfil.cedula, 'Foto_Defecto.png');
      logger.info('Perfil creado exitosamente.');
      res.status(201).json({ message: 'Perfil creado exitosamente.', success: true });
    } catch (error) {
      logger.error('Error al crear perfil:', error as Error);
      const err = error as Error;

      if (err.message === 'Perfil ya existe') {
        res.status(409).json({ message: 'Perfil ya existe', success: false });
      } else {
        res.status(500).json({ message: 'Error interno del servidor', success: false });
      }
    }
  }

  public async obtenerPerfil(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user?.id as string;
      if (!id) {
        logger.warn('ID de usuario no proporcionado.');
        res.status(400).json({ message: 'ID de usuario no proporcionado.' });
      }
      const perfil = await PerfilService.obtenerPerfilPorId(id);
      if (!perfil) {
        logger.warn('Perfil no encontrado.');
        res.status(404).json({ message: 'Perfil no encontrado.' });
      }
      logger.info('Perfil obtenido exitosamente.');
      res.status(200).json(perfil);
    } catch (error) {
      logger.error('Error al obtener perfil:', error as Error);
      next(error);
    }
  }

  public async actualizarPerfil(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user?.id as string;
      if (!id) {
        logger.warn('ID de usuario no proporcionado.');
        res.status(400).json({ message: 'ID de usuario no proporcionado.' });
      }
      const data: ActualizarPerfilDto = req.body;
      const perfilActualizado = await PerfilService.actualizarPerfil(id, data);
      if (!perfilActualizado) {
        logger.warn('Perfil no encontrado.');
        res.status(404).json({ message: 'Perfil no encontrado.' });
      }
      logger.info('Perfil actualizado exitosamente.');
      res.status(200).json({ message: 'Perfil actualizado exitosamente.', perfilActualizado });
    } catch (error) {
      logger.error('Error al actualizar perfil:', error as Error);
      next(error);
    }
  }

  public async eliminarPerfil(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user?.id as string;
      if (!id) {
        logger.warn('ID de usuario no proporcionado.');
        res.status(400).json({ message: 'ID de usuario no proporcionado.' });
      }
      await PerfilService.eliminarPerfil(id);
      logger.info('Perfil eliminado exitosamente.');
      res.status(200).json({ message: 'Perfil eliminado exitosamente.' });
    } catch (error) {
      logger.error('Error al eliminar perfil:', error as Error);
      next(error);
    }
  }

  public async crearPerfilAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CrearPerfilDto = req.body;
      data.rol = 'Administrador';
      const perfil = await PerfilService.crearPerfil(data);
      logger.info('Perfil creado exitosamente por el administrador.');
      res.status(201).json({ message: 'Perfil creado exitosamente por el administrador.', perfil });
    } catch (error) {
      logger.error('Error al crear perfil por el administrador:', error as Error);
      next(error);
    }
  }

  public async obtenerPerfilPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        logger.warn('ID de perfil no proporcionado.');
        res.status(400).json({ message: 'ID de perfil no proporcionado.' });
      }
      const perfil = await PerfilService.obtenerPerfilPorId(id);
      if (!perfil) {
        logger.warn('Perfil no encontrado.');
        res.status(404).json({ message: 'Perfil no encontrado.' });
      }
      logger.info('Perfil obtenido exitosamente.');
      res.status(200).json(perfil);
    } catch (error) {
      logger.error('Error al obtener perfil por ID:', error as Error);
      next(error);
    }
  }

  public async actualizarPerfilAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        logger.warn('ID de perfil no proporcionado.');
        res.status(400).json({ message: 'ID de perfil no proporcionado.' });
      }
      const data: ActualizarPerfilDto = req.body;
      const perfilActualizado = await PerfilService.actualizarPerfil(id, data);
      if (!perfilActualizado) {
        logger.warn('Perfil no encontrado.');
        res.status(404).json({ message: 'Perfil no encontrado.' });
      }
      logger.info('Perfil actualizado exitosamente por el administrador.');
      res.status(200).json({ message: 'Perfil actualizado exitosamente por el administrador.', perfilActualizado });
    } catch (error) {
      logger.error('Error al actualizar perfil por el administrador:', error as Error);
      next(error);
    }
  }

  public async eliminarPerfilAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        logger.warn('ID de perfil no proporcionado.');
        res.status(400).json({ message: 'ID de perfil no proporcionado.' });
      }
      await PerfilService.eliminarPerfil(id);
      logger.info('Perfil eliminado exitosamente por el administrador.');
      res.status(200).json({ message: 'Perfil eliminado exitosamente por el administrador.' });
    } catch (error) {
      logger.error('Error al eliminar perfil por el administrador:', error as Error);
      next(error);
    }
  }

  public async obtenerCasillerosAsociados(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user?.id as string;
      if (!id) {
        logger.warn('ID de usuario no proporcionado.');
        res.status(400).json({ message: 'ID de usuario no proporcionado.' });
      }
      const casilleros = await PerfilService.obtenerCasillerosAsociados(id);
      logger.info('Casilleros asociados obtenidos exitosamente.');
      res.status(200).json(casilleros);
    } catch (error) {
      logger.error('Error al obtener casilleros asociados:', error as Error);
      next(error);
    }
  }

  public async obtenerSolicitudesAsociadas(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user?.id as string;
      if (!id) {
        logger.warn('ID de usuario no proporcionado.');
        res.status(400).json({ message: 'ID de usuario no proporcionado.' });
      }
      const query = req.query;
      const solicitudes = await PerfilService.obtenerSolicitudesAsociadas(id, query);
      logger.info('Solicitudes asociadas obtenidas exitosamente.');
      res.status(200).json(solicitudes);
    } catch (error) {
      logger.error('Error al obtener solicitudes asociadas:', error as Error);
      next(error);
    }
  }
}

export default new PerfilController();