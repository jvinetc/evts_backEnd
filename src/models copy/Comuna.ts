import mongoose from 'mongoose';
import { IComuna } from '../interface/Comuna';

const comunaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    latitude:  {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
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

export const Comuna = mongoose.model<IComuna>('Comuna', comunaSchema);