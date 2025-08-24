import { IComuna } from "./Comuna";

export interface IDriver {
    id?: number,
    userId: number,
    patente: string,
    permisoCirculacion: string,
    vencimientoPermisoCirculacion: Date,
    revicionTecnica: string,
    vencimientoRevicionTecnica: Date,
    liceciaConducir: string,
    vencimientoLiceciaConducir: Date,
    status: string,
    createAt: Date,
    updateAt?: Date,
    Comunas?: IComuna[];
}