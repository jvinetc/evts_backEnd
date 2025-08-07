
export interface IDriver {
    id?: number,
    userId: number,
    patente: string,
    permisoCirculacion: string,
    revicionTecnica: string,
    liceciaConducir: string,
    status: string,
    createAt: Date,
    updateAt?: Date,
}