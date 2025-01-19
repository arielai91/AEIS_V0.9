import CasilleroModel from '@models/Casillero/Casillero';
import { ICasillero } from '@models/Casillero/Casillero';
import { CrearCasilleroDto } from '@dtos/casillero.dto';

class CasilleroService {
    /**
     * Crear un nuevo casillero en la base de datos.
     * @param datosCasillero Información del casillero a crear.
     * @returns El casillero creado.
     */
    public async crearCasillero(datosCasillero: CrearCasilleroDto): Promise<ICasillero> {
        const casillero = new CasilleroModel(datosCasillero);
        return await casillero.save();
    }

    /**
     * Eliminar un casillero de la base de datos.
     * @param casilleroId ID del casillero a eliminar.
     */
    public async eliminarCasillero(casilleroId: string): Promise<void> {
        const casillero = await CasilleroModel.findById(casilleroId);

        if (!casillero) {
            throw new Error('Casillero no encontrado');
        }

        if (casillero.perfil) {
            throw new Error('No se puede eliminar el casillero porque está asignado a un usuario');
        }

        await CasilleroModel.findByIdAndDelete(casilleroId);
    }
}

export default new CasilleroService();