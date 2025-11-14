import { IComuna } from "./Comuna";

export interface IRateAddition {
    id?: number,
    price?: string,
    rateId?: number,
    comunaId?: number,
    createAt?: Date,
    updateAt?: Date,
    Comuna?: IComuna
}