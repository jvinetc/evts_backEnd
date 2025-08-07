import mongoose from 'mongoose';
import { ISell } from '../interface/Sell';

const sellSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comuna:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comuna'
    },
    addres:{
        type:String
    },
    addresPickup:{
        type:String,
        required:true
    },
    state:{
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

export const Sell = mongoose.model<ISell>('Sell', sellSchema);