import { Document, ObjectId } from 'mongoose';

export interface IRate extends Document {
    _id: ObjectId,
    nameService: String,
    price:String,
    state:String,
    createAt: Date;
    updateAt?: Date;
}