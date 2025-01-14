import { Schema } from 'mongoose';

const solicitudSchema = new Schema({
    perfil: {
        type: Schema.Types.ObjectId,
        ref: 'perfils', // Relación con el esquema Perfil
        required: true,
        index: true,
    },
    tipo: {
        type: String,
        enum: ['Plan', 'Casillero'], // Tipos permitidos
        required: true,
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'plans', // Solo si el tipo es 'Plan'
    },
    casillero: {
        type: Schema.Types.ObjectId,
        ref: 'casilleros', // Solo si el tipo es 'Casillero'
    },
    fechaEnvio: {
        type: Date,
        default: Date.now, // Fecha de envío al momento de creación
    },
    fechaAprobacion: {
        type: Date, // Fecha de aprobación, inicialmente nula
        default: null,
    },
    imagen: {
        type: String, // URL o ruta de la imagen
    },
    estado: {
        type: String,
        enum: ['Aprobado', 'Rechazado', 'Por verificar'], // Estados válidos
        default: 'Por verificar',
        index: true,
    },
}, {
    timestamps: true, // Incluye createdAt y updatedAt
});


export default solicitudSchema;