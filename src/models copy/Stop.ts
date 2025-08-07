import mongoose from 'mongoose';
import { IStop } from '../interface/Stop';

const stopSchema = new mongoose.Schema({
    addresName:{
        type:String, 
        required:true
    },
    addres: {
        type: String,
        required: true
    },
    comuna: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comuna',
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    notes:{
        type:String,
        required:false
    },
    photos:{
        type:String,
        required:false
    },
    status:{
        type:String,
        required:true,
        default:'pickUp'
    },
    sell:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sell',
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    driver:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Driver',        
        required:true
    },
    rate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Rate',
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

export const Stop = mongoose.model<IStop>('Stop', stopSchema);