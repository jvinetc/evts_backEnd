import mongoose from 'mongoose';

const stopApiSchema = new mongoose.Schema({
    addresName: {
        type: String,
        required: true
    },
    addresLineOne: {
        type: String,
        required: true
    },
    addresLineTwo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comuna'
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip:{
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    latitude:{
        type: String,
        required: true
    },
    longitude:{
        type: String,
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

export const StopApi = mongoose.model('StopApi', stopApiSchema);