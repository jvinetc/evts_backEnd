import { IComuna } from "./Comuna";
import { IUser } from "./User";

export interface IDriver {
    id?: number,
    userId?: number,
    patente?: string,
    permisoCirculacion?: string,
    vencimientoPermisoCirculacion?: Date,
    revicionTecnica?: string,
    vencimientoRevicionTecnica?: Date,
    liceciaConducir?: string,
    vencimientoLiceciaConducir?: Date,
    status?: string,
    urlPermisoCirculacion?: string;
    urlRevicionTecnica?: string;
    urlLiceciaConducir?: string;
    createAt?: Date,
    updateAt?: Date,
    Comunas?: IComuna[];
    User?:IUser;
}

export interface StatsDriver {
    monthDelivery: number;
    monthPickup: number;
    monthFailed: number;
    historicalDelivery: number;
    historicalPickup: number;
    historicalFailed: number;
}