import mongoose from 'mongoose';
import { IRate } from '../interface/Rate';

const rateSchema = new mongoose.Schema({
    nameService: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    state: {
        type: String,
        required: true,
        default:'activo'
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

export const Rate = mongoose.model<IRate>('Rate', rateSchema);