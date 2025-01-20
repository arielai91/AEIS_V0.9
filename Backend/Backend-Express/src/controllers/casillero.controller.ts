import { Request, Response, NextFunction } from 'express';
import CasilleroService from '@services/casillero.service';

class CasilleroController {
  /**
   * Crear un casillero.
   */
  public async crearCasillero(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const casillero = await CasilleroService.crearCasillero(req.body);
      res.status(201).json({ message: 'Casillero creado exitosamente.', casillero });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todos los casilleros.
   */
  public async obtenerCasilleros(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const casilleros = await CasilleroService.obtenerCasilleros(req.query);
      res.status(200).json(casilleros);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un casillero por ID.
   */
  public async obtenerCasilleroPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const casillero = await CasilleroService.obtenerCasilleroPorId(id);
      if (!casillero) {
        res.status(404).json({ message: 'Casillero no encontrado.' });
      }
      res.status(200).json(casillero);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar un casillero.
   */
  public async eliminarCasillero(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.body;
      await CasilleroService.eliminarCasillero(id);
      res.status(200).json({ message: 'Casillero eliminado exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Asignar un casillero a un perfil.
   */
  public async asignarCasillero(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await CasilleroService.asignarCasillero(req.body);
      res.status(200).json({ message: 'Casillero asignado exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Liberar un casillero.
   */
  public async liberarCasillero(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await CasilleroService.liberarCasillero(req.body);
      res.status(200).json({ message: 'Casillero liberado exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar el estado de un casillero.
   */
  public async actualizarEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await CasilleroService.actualizarEstado(req.body);
      res.status(200).json({ message: 'Estado del casillero actualizado exitosamente.' });
    } catch (error) {
      next(error);
    }
  }
}

export default new CasilleroController();
