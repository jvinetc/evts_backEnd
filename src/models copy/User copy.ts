import mongoose from 'mongoose';
import { IUser } from '../interface/User';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    phone: {
        mobile: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: false
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    photo:{
        type:String,
        require:false
    },
    verification_token:{
        type: String,
        required: false
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

export const User = mongoose.model<IUser>('User', userSchema);