import { IAddressStop } from "./AddressStop";

export interface IStopApi {
    id?: number;
    id_router_api?: string;
    plan?: string;
    planId?: number;
    routeId?: number;
    addressStopId?: number;
    barcode?:string;
    driverIdentifier?: string; //email
    notes?: string;
    orderInfiId?: number;
    packageCount?: number;
    type?: string;
    activity?:string;
    createdAt?: Date;
    updatedAt?: Date;
    AddressStop?:IAddressStop;
    externalId?:number;
}