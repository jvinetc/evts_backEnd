import { Document, ObjectId } from 'mongoose';

export interface IComuna extends Document {
    _id: ObjectId,
    name: String,
    createAt: Date;
    updateAt?: Date;
}