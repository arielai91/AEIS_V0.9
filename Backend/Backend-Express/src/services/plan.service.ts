import PlanModel from '@models/Plan/Plan';
import PerfilModel from '@models/Perfil/Perfil';
import { CrearPlanDto, ActualizarPlanDto } from '@dtos/plan.dto';
import { Schema } from 'mongoose';
import { IPlan } from '@type/global';

class PlanService {
    public async crearPlan(datosPlan: CrearPlanDto): Promise<IPlan> {
        if (datosPlan.esPorDefecto) {
            await PlanModel.updateMany({ esPorDefecto: true }, { esPorDefecto: false });
        }
        const nuevoPlan = await PlanModel.create(datosPlan);
        return nuevoPlan.toObject();
    }

    public async eliminarPlan(planId: string): Promise<void> {
        const plan = await PlanModel.findById(planId);
        if (!plan) throw new Error('Plan no encontrado.');
        if (plan.usuarios.length > 0) throw new Error('No se puede eliminar un plan con usuarios asociados.');
        await plan.deleteOne();
    }

    public async actualizarPlan(planId: string, datos: Partial<ActualizarPlanDto>): Promise<IPlan> {
        const plan = await PlanModel.findById(planId);
        if (!plan) throw new Error('Plan no encontrado.');
        if (datos.esPorDefecto) {
            await PlanModel.updateMany({ esPorDefecto: true }, { esPorDefecto: false });
        }
        Object.assign(plan, datos);
        await plan.save();
        return plan.toObject();
    }

    public async obtenerPlanes(filtros: { nombre?: string; precio?: number; esPorDefecto?: boolean }): Promise<IPlan[]> {
        const query: Record<string, unknown> = {};
        if (filtros.nombre) query.nombre = filtros.nombre;
        if (filtros.precio) query.precio = filtros.precio;
        if (filtros.esPorDefecto !== undefined) query.esPorDefecto = filtros.esPorDefecto;
        return await PlanModel.find(query).exec();
    }

    public async cambiarPlanPredeterminado(planId: string): Promise<IPlan> {
        await PlanModel.updateMany({ esPorDefecto: true }, { esPorDefecto: false });
        const plan = await PlanModel.findByIdAndUpdate(planId, { esPorDefecto: true }, { new: true });
        if (!plan) throw new Error('Plan no encontrado.');
        return plan.toObject();
    }

    public async asignarUsuario(planId: string, usuarioId: string): Promise<IPlan> {
        const plan = await PlanModel.findById(planId);
        if (!plan) throw new Error('Plan no encontrado.');
        const usuario = await PerfilModel.findById(usuarioId);
        if (!usuario) throw new Error('Usuario no encontrado.');
        if (!plan.usuarios.includes(usuarioId as unknown as Schema.Types.ObjectId)) {
            plan.usuarios.push(usuarioId as unknown as Schema.Types.ObjectId);
        }
        await plan.save();
        return plan.toObject();
    }

    public async eliminarUsuario(planId: string, usuarioId: string): Promise<IPlan> {
        const plan = await PlanModel.findById(planId);
        if (!plan) throw new Error('Plan no encontrado.');
        const usuarioIndex = plan.usuarios.findIndex((id) => id.toString() === usuarioId);
        if (usuarioIndex === -1) throw new Error('Usuario no asociado a este plan.');
        plan.usuarios.splice(usuarioIndex, 1);
        await plan.save();
        return plan.toObject();
    }
}

export default new PlanService();