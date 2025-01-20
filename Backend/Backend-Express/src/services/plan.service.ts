import PlanModel from '@models/Plan/Plan';
import PerfilModel from '@models/Perfil/Perfil';
import { CrearPlanDto, ActualizarPlanDto, AsignarUsuarioDto, EliminarUsuarioDto, PlanesQueryDto } from '@dtos/plan.dto';
import { IPlan } from '@type/global';
import { FilterQuery, Schema } from 'mongoose';

class PlanService {
    /**
     * Crear un nuevo plan.
     */
    public async crearPlan(data: CrearPlanDto): Promise<IPlan> {
        const nuevoPlan = new PlanModel(data);

        // Si es plan predeterminado, asegúrate de que no haya otros predeterminados
        if (data.esPorDefecto) {
            await PlanModel.updateMany({ esPorDefecto: true }, { esPorDefecto: false });
        }

        return await nuevoPlan.save();
    }

    /**
     * Obtener todos los planes con filtros.
     */
    public async obtenerPlanes(filtros: PlanesQueryDto): Promise<IPlan[]> {
        const { nombre, precioMin, precioMax } = filtros;

        const query: FilterQuery<IPlan> = {};
        if (nombre) query.nombre = nombre;
        if (precioMin) query.precio = { $gte: precioMin };
        if (precioMax) query.precio = { ...query.precio, $lte: precioMax };

        return await PlanModel.find(query).exec();
    }

    /**
     * Obtener un plan por ID.
     */
    public async obtenerPlanPorId(planId: string): Promise<IPlan | null> {
        return await PlanModel.findById(planId).exec();
    }

    /**
     * Actualizar un plan.
     */
    public async actualizarPlan(id: string, data: ActualizarPlanDto): Promise<void> {
        const plan = await PlanModel.findById(id).exec();
        if (!plan) {
            throw new Error('El plan especificado no existe.');
        }

        // Actualizar el estado de "plan predeterminado"
        if (data.esPorDefecto && !plan.esPorDefecto) {
            await PlanModel.updateMany({ esPorDefecto: true }, { esPorDefecto: false });
        }

        Object.assign(plan, data);
        await plan.save();
    }

    /**
     * Eliminar un plan.
     */
    public async eliminarPlan(planId: string): Promise<void> {
        const plan = await PlanModel.findByIdAndDelete(planId).exec();
        if (!plan) {
            throw new Error('El plan especificado no existe.');
        }
    }

    /**
     * Asignar un usuario a un plan.
     */
    public async asignarUsuario(data: AsignarUsuarioDto): Promise<void> {
        const { planId, usuarioId } = data;

        const plan = await PlanModel.findById(planId).exec();
        if (!plan) {
            throw new Error('El plan especificado no existe.');
        }

        const perfil = await PerfilModel.findById(usuarioId).exec();
        if (!perfil) {
            throw new Error('El usuario especificado no existe.');
        }

        // Asignar usuario al plan
        plan.usuarios.push(new Schema.Types.ObjectId(usuarioId));
        perfil.plan = new Schema.Types.ObjectId(planId);
        await plan.save();
        await perfil.save();
    }

    /**
     * Eliminar un usuario de un plan.
     */
    public async eliminarUsuario(data: EliminarUsuarioDto): Promise<void> {
        const { planId, usuarioId } = data;

        const plan = await PlanModel.findById(planId).exec();
        if (!plan) {
            throw new Error('El plan especificado no existe.');
        }

        const perfil = await PerfilModel.findById(usuarioId).exec();
        if (!perfil) {
            throw new Error('El usuario especificado no existe.');
        }

        // Eliminar usuario del plan
        plan.usuarios = plan.usuarios.filter((id) => id.toString() !== usuarioId);
        if (perfil.plan?.toString() === planId) {
            perfil.plan = null;
        }

        await plan.save();
        await perfil.save();
    }
}

export default new PlanService();