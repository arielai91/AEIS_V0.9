import { Request, Response } from 'express';
import PlanService from '@services/plan.service';
import logger from '@logger/logger';

class PlanController {
  // Crear un nuevo plan
  public async crearPlan(req: Request, res: Response): Promise<void> {
    try {
      const planCreado = await PlanService.crearPlan(req.body);
      res.status(201).json({
        success: true,
        message: 'Plan creado exitosamente.',
        data: planCreado,
      });
    } catch (error) {
      logger.error('Error al crear plan:', error as Error);
      res.status(400).json({
        success: false,
        message: (error as Error).message || 'Error al crear plan.',
      });
    }
  }

  // Eliminar un plan
  public async eliminarPlan(req: Request, res: Response): Promise<void> {
    try {
      const { planId } = req.body;
      await PlanService.eliminarPlan(planId);
      res.status(200).json({
        success: true,
        message: 'Plan eliminado exitosamente.',
      });
    } catch (error) {
      logger.error('Error al eliminar plan:', error as Error);
      res.status(400).json({
        success: false,
        message: (error as Error).message || 'Error al eliminar plan.',
      });
    }
  }

  // Actualizar un plan
  public async actualizarPlan(req: Request, res: Response): Promise<void> {
    try {
      const { planId, ...datosActualizacion } = req.body;
      const planActualizado = await PlanService.actualizarPlan(planId, datosActualizacion);
      res.status(200).json({
        success: true,
        message: 'Plan actualizado exitosamente.',
        data: planActualizado,
      });
    } catch (error) {
      logger.error('Error al actualizar plan:', error as Error);
      res.status(400).json({
        success: false,
        message: (error as Error).message || 'Error al actualizar plan.',
      });
    }
  }

  // Obtener planes
  public async obtenerPlanes(req: Request, res: Response): Promise<void> {
    try {
      const planes = await PlanService.obtenerPlanes(req.query);
      res.status(200).json({
        success: true,
        message: 'Planes obtenidos exitosamente.',
        data: planes,
      });
    } catch (error) {
      logger.error('Error al obtener planes:', error as Error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'Error al obtener planes.',
      });
    }
  }

  // Cambiar el plan predeterminado
  public async cambiarPlanPredeterminado(req: Request, res: Response): Promise<void> {
    try {
      const { planId } = req.body;
      const planActualizado = await PlanService.cambiarPlanPredeterminado(planId);
      res.status(200).json({
        success: true,
        message: 'Plan predeterminado cambiado exitosamente.',
        data: planActualizado,
      });
    } catch (error) {
      logger.error('Error al cambiar el plan predeterminado:', error as Error);
      res.status(400).json({
        success: false,
        message: (error as Error).message || 'Error al cambiar el plan predeterminado.',
      });
    }
  }

  // Asignar un usuario a un plan
  public async asignarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { planId, usuarioId } = req.body;
      const planActualizado = await PlanService.asignarUsuario(planId, usuarioId);
      res.status(200).json({
        success: true,
        message: 'Usuario asignado al plan exitosamente.',
        data: planActualizado,
      });
    } catch (error) {
      logger.error('Error al asignar usuario al plan:', error as Error);
      res.status(400).json({
        success: false,
        message: (error as Error).message || 'Error al asignar usuario al plan.',
      });
    }
  }

  // Eliminar un usuario de un plan
  public async eliminarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { planId, usuarioId } = req.body;
      const planActualizado = await PlanService.eliminarUsuario(planId, usuarioId);
      res.status(200).json({
        success: true,
        message: 'Usuario eliminado del plan exitosamente.',
        data: planActualizado,
      });
    } catch (error) {
      logger.error('Error al eliminar usuario del plan:', error as Error);
      res.status(400).json({
        success: false,
        message: (error as Error).message || 'Error al eliminar usuario del plan.',
      });
    }
  }
}

export default new PlanController();
