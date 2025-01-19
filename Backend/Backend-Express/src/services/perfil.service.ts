import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import PerfilModel from '@models/Perfil/Perfil';
import Plan from '@models/Plan/Plan';
import { IPerfil } from '@type/global';
import { CrearPerfilDto } from '@dtos/perfil.dto';

class PerfilService {
    /**
     * Crear un nuevo perfil en la base de datos.
     * @param datosPerfil Información del perfil a crear.
     * @returns El perfil creado.
     */
    public async crearPerfil(datosPerfil: CrearPerfilDto): Promise<IPerfil> {
        // Validar y sanitizar los datos proporcionados
        if (!validator.isEmail(datosPerfil.email)) {
            throw new Error('El email proporcionado no es válido.');
        }
        if (!validator.isLength(datosPerfil.contraseña, { min: 6 })) {
            throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
        if (!validator.isLength(datosPerfil.cedula, { min: 10, max: 10 })) {
            throw new Error('La cédula debe contener exactamente 10 dígitos.');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(datosPerfil.contraseña, 10);

        // Obtener el plan por defecto
        const planPorDefecto = await Plan.findOne({ esPorDefecto: true });
        const planId = planPorDefecto ? planPorDefecto._id : null;

        // Crear el perfil con los datos sanitizados
        const perfil = new PerfilModel({
            rol: validator.escape(datosPerfil.rol),
            nombreCompleto: validator.escape(datosPerfil.nombreCompleto),
            email: validator.normalizeEmail(datosPerfil.email),
            cedula: validator.escape(datosPerfil.cedula),
            contraseña: hashedPassword,
            plan: planId,
        });

        return await perfil.save();
    }

    /**
     * Eliminar perfil de la base de datos.
     * @param userId ID del usuario a eliminar.
     */
    public async eliminarPerfil(userId: string): Promise<void> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new Error('ID no válido');
        }
        await PerfilModel.findByIdAndDelete(userId);
    }
}

export default new PerfilService();