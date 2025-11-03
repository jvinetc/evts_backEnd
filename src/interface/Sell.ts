import { IComuna } from "./Comuna";
import { IUser } from "./User";

export interface ISell {
    id?: number,
    name: string,
    comunaId: number,
    userId: number,
    addres: string,
    addresPickup: string,
    state: string,
    createAt?: Date,
    updateAt?: Date,
    Comuna?: IComuna;
    User?: IUser;
    lat?: number,
    lng?: number,
    email?: string;
    reference?: string;

}
