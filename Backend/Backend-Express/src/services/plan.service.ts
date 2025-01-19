import PlanModel from '@models/Plan/Plan';
import { IPlan } from '@models/Plan/Plan';
import { CrearPlanDto } from '@dtos/plan.dto';

class PlanService {
    /**
     * Crear un nuevo plan en la base de datos.
     * @param datosPlan Información del plan a crear.
     * @returns El plan creado.
     */
    public async crearPlan(datosPlan: CrearPlanDto): Promise<IPlan> {
        const plan = new PlanModel(datosPlan);
        return await plan.save();
    }

    /**
     * Eliminar un plan de la base de datos.
     * @param planId ID del plan a eliminar.
     */
    public async eliminarPlan(planId: string): Promise<void> {
        const plan = await PlanModel.findById(planId);

        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        if (plan.usuarios.length > 0) {
            throw new Error('No se puede eliminar el plan porque tiene usuarios asignados');
        }

        await PlanModel.findByIdAndDelete(planId);
    }
}

export default new PlanService();