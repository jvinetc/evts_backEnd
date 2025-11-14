export interface IPickUp {
    id?: number;
    sellId?: number;
    driverId?: number;
    stopsId?: number[];
    createAt?: Date;
    updateAt?: Date;
    pickuDate?: string;
    evidence?: string[];
    userId?: number;
}