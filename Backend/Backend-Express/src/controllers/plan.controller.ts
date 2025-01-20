import { Request, Response, NextFunction } from 'express';
import PlanService from '@services/plan.service';

class PlanController {
  /**
   * Crear un nuevo plan.
   */
  public async crearPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = await PlanService.crearPlan(req.body);
      res.status(201).json({ message: 'Plan creado exitosamente.', plan });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todos los planes.
   */
  public async obtenerPlanes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const planes = await PlanService.obtenerPlanes(req.query);
      res.status(200).json(planes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un plan por ID.
   */
  public async obtenerPlanPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = await PlanService.obtenerPlanPorId(req.params.id);
      if (!plan) {
        res.status(404).json({ message: 'Plan no encontrado.' });
      }
      res.status(200).json(plan);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar un plan.
   */
  public async actualizarPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await PlanService.actualizarPlan(req.params.id, req.body);
      res.status(200).json({ message: 'Plan actualizado exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar un plan.
   */
  public async eliminarPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await PlanService.eliminarPlan(req.params.id);
      res.status(200).json({ message: 'Plan eliminado exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Asignar un usuario a un plan.
   */
  public async asignarUsuario(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await PlanService.asignarUsuario(req.body);
      res.status(200).json({ message: 'Usuario asignado al plan exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar un usuario de un plan.
   */
  public async eliminarUsuario(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await PlanService.eliminarUsuario(req.body);
      res.status(200).json({ message: 'Usuario eliminado del plan exitosamente.' });
    } catch (error) {
      next(error);
    }
  }
}

export default new PlanController();
