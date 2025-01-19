import { Request, Response } from 'express';
import CasilleroService from '@services/casillero.service';
import logger from '@logger/logger';
import { CrearCasilleroDto, EliminarCasilleroDto } from '@dtos/casillero.dto';

class CasilleroController {
  /**
   * Crear un nuevo casillero.
   */
  public async crearCasillero(req: Request, res: Response): Promise<void> {
    try {
      const datosCasillero: CrearCasilleroDto = req.body;
      const casilleroCreado = await CasilleroService.crearCasillero(datosCasillero);
      res.status(201).json(casilleroCreado);
    } catch (err) {
      logger.error('Error al crear casillero:', err as Error);
      res.status(400).json({ message: 'Error al crear casillero' });
    }
  }

  /**
   * Eliminar un casillero.
   */
  public async eliminarCasillero(req: Request, res: Response): Promise<void> {
    try {
      const { casilleroId }: EliminarCasilleroDto = req.body;

      if (!casilleroId) {
        res.status(400).json({ message: 'Falta el ID del casillero' });
        return;
      }

      await CasilleroService.eliminarCasillero(casilleroId);
      res.status(200).json({ message: 'Casillero eliminado exitosamente' });
    } catch (err) {
      logger.error('Error al eliminar casillero:', err as Error);
      res.status(500).json({ message: 'Error al eliminar casillero' });
    }
  }
}

export default new CasilleroController();