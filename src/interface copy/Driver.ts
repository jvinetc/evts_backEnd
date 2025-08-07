import { Document, ObjectId } from 'mongoose';

export interface IDriver extends Document {
    _id: ObjectId,
    user: ObjectId,
    patente: String,
    docs: {
        permisoCirculacion: String,
        revicionTecnica: String,
        liceciaConducir: String,
    },
    comunas: [ObjectId],
    status: String,
    createAt: Date;
    updateAt?: Date;
}