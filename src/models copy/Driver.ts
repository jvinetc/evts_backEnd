import mongoose from 'mongoose';
import { IDriver } from '../interface/Driver';

const driverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    patente:{
        type:String,
        required:true
    },
    docs:{
        permisoCirculacion:String,
        revicionTecnica:String,
        liceciaConducir:String,
    },
    comunas:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comunas"
    }],
    status:{
        type:String,
        required:true
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        required: false
    }
});

export const Driver = mongoose.model<IDriver>('Driver', driverSchema);