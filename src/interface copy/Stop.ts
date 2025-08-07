import { Document, ObjectId } from 'mongoose';

export interface IStop extends Document {
  _id: ObjectId;
  addresName: string;
  addres: string;
  comuna: ObjectId;
  phone: string;
  notes?: string;
  photos?: string;
  status: string;
  sell: ObjectId;
  user: ObjectId;
  driver: ObjectId;
  rate: ObjectId;
  createAt: Date;
  updateAt?: Date;
}