import { Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
    _id: ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    age: Number,
    state: String,
    phone: {
        mobile: String,
        contact?: String
    },
    password: String,
    role: ObjectId,
    photo?:String,
    verification_token: String | null,
    createAt: Date;
    updateAt?: Date;
}