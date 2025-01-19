import { Request, Response } from 'express';
import PlanService from '@services/plan.service';
import logger from '@logger/logger';
import { CrearPlanDto, EliminarPlanDto } from '@dtos/plan.dto';

class PlanController {
  /**
   * Crear un nuevo plan.
   */
  public async crearPlan(req: Request, res: Response): Promise<void> {
    try {
      const datosPlan: CrearPlanDto = req.body;
      const planCreado = await PlanService.crearPlan(datosPlan);
      res.status(201).json(planCreado);
    } catch (err) {
      logger.error('Error al crear plan:', err as Error);
      res.status(400).json({ message: 'Error al crear plan' });
    }
  }

  /**
   * Eliminar un plan.
   */
  public async eliminarPlan(req: Request, res: Response): Promise<void> {
    try {
      const { planId }: EliminarPlanDto = req.body;

      if (!planId) {
        res.status(400).json({ message: 'Falta el ID del plan' });
        return;
      }

      await PlanService.eliminarPlan(planId);
      res.status(200).json({ message: 'Plan eliminado exitosamente' });
    } catch (err) {
      logger.error('Error al eliminar plan:', err as Error);
      res.status(500).json({ message: 'Error al eliminar plan' });
    }
  }
}

export default new PlanController();