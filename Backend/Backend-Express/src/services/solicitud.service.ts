import SolicitudModel from '@models/Solicitud/Solicitud';
import { ISolicitud } from '@models/Solicitud/Solicitud';
import { CrearSolicitudDto } from '@dtos/solicitud.dto';

class SolicitudService {
    /**
     * Crear una nueva solicitud en la base de datos.
     * @param datosSolicitud Información de la solicitud a crear.
     * @returns La solicitud creada.
     */
    public async crearSolicitud(datosSolicitud: CrearSolicitudDto): Promise<ISolicitud> {
        const solicitud = new SolicitudModel(datosSolicitud);
        return await solicitud.save();
    }

    /**
     * Eliminar una solicitud de la base de datos.
     * @param solicitudId ID de la solicitud a eliminar.
     */
    public async eliminarSolicitud(solicitudId: string): Promise<void> {
        const solicitud = await SolicitudModel.findById(solicitudId);

        if (!solicitud) {
            throw new Error('Solicitud no encontrada');
        }

        await SolicitudModel.findByIdAndDelete(solicitudId);
    }
}

export default new SolicitudService();