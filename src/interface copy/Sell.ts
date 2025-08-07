import { Document, ObjectId } from 'mongoose';

export interface ISell extends Document {
    _id: ObjectId,
    name: String,
    comuna:ObjectId,
    user:ObjectId,
    addres:String,
    addresPickup:String,
    state:String,
    createAt: Date;
    updateAt?: Date;
}
