import { IRateAddition } from "./RateAddition"

export interface IRate {
    id?: number,
    nameService: string,
    price:string,
    state:string,
    createAt: Date,
    updateAt?: Date,
    isBase?: boolean,
    type?: string
    RateAdditions?: IRateAddition[]
}