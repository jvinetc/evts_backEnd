import mongoose from 'mongoose';
import { IRole } from '../interface/Role';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type:String
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

export const Role = mongoose.model<IRole>('Role', roleSchema);