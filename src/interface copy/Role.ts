import { Document, ObjectId } from 'mongoose';

export interface IRole extends Document {
    _id: ObjectId,
    name: String,
    description?:String,
    createAt: Date;
    updateAt?: Date;
}