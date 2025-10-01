import { IDepot } from "./Depot";

export interface IDriverApi {
    id?: number | string;
    id_router_api?: string | number;
    name?: string;
    email?: string;
    phone?: string;
    displayName?: string;
    active?: boolean;
    depots?: IDepot[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDriverResponse {
    drivers: IDriverApi[];
    nextPageToken: string;
}

export interface IDriverCreate {
    id?:string
    name?: string;
    displayName?: string;
    email?: string;
    phone?: string;
}

export interface IResponseCreateDriver{
    driverApi:IDriverCreate
}