import { Request, Response } from 'express';
import CasilleroService from '@services/casillero.service';
import logger from '@logger/logger';

class CasilleroController {
  public async crearCasillero(req: Request, res: Response): Promise<void> {
    try {
      const casilleroCreado = await CasilleroService.crearCasillero(req.body);
      res.status(201).json({ success: true, message: 'Casillero creado exitosamente.', data: casilleroCreado });
    } catch (error) {
      logger.error('Error al crear casillero:', error as Error);
      res.status(400).json({ success: false, message: (error as Error).message || 'Error al crear casillero.' });
    }
  }

  public async eliminarCasillero(req: Request, res: Response): Promise<void> {
    try {
      await CasilleroService.eliminarCasillero(req.body.casilleroId);
      res.status(200).json({ success: true, message: 'Casillero eliminado exitosamente.' });
    } catch (error) {
      logger.error('Error al eliminar casillero:', error as Error);
      res.status(500).json({ success: false, message: (error as Error).message || 'Error al eliminar casillero.' });
    }
  }

  public async asignarPerfil(req: Request, res: Response): Promise<void> {
    try {
      const { casilleroId, perfilId } = req.body;
      const casilleroActualizado = await CasilleroService.asignarPerfil(casilleroId, perfilId);
      res.status(200).json({ success: true, message: 'Perfil asignado exitosamente.', data: casilleroActualizado });
    } catch (error) {
      logger.error('Error al asignar perfil:', error as Error);
      res.status(400).json({ success: false, message: (error as Error).message || 'Error al asignar perfil.' });
    }
  }

  public async liberarCasillero(req: Request, res: Response): Promise<void> {
    try {
      const casilleroActualizado = await CasilleroService.liberarCasillero(req.body.casilleroId);
      res.status(200).json({ success: true, message: 'Casillero liberado exitosamente.', data: casilleroActualizado });
    } catch (error) {
      logger.error('Error al liberar casillero:', error as Error);
      res.status(400).json({ success: false, message: (error as Error).message || 'Error al liberar casillero.' });
    }
  }

  public async actualizarEstado(req: Request, res: Response): Promise<void> {
    try {
      const { casilleroId, estado } = req.body;
      const casilleroActualizado = await CasilleroService.actualizarEstado(casilleroId, estado);
      res.status(200).json({ success: true, message: 'Estado del casillero actualizado exitosamente.', data: casilleroActualizado });
    } catch (error) {
      logger.error('Error al actualizar estado del casillero:', error as Error);
      res.status(400).json({ success: false, message: (error as Error).message || 'Error al actualizar estado del casillero.' });
    }
  }

  public async obtenerCasilleros(req: Request, res: Response): Promise<void> {
    try {
      const filtros = req.query;
      const casilleros = await CasilleroService.obtenerCasilleros(filtros);
      res.status(200).json({ success: true, message: 'Casilleros obtenidos exitosamente.', data: casilleros });
    } catch (error) {
      logger.error('Error al obtener casilleros:', error as Error);
      res.status(500).json({ success: false, message: (error as Error).message || 'Error al obtener casilleros.' });
    }
  }
}

export default new CasilleroController();