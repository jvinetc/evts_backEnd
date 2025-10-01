export interface IDeliveryInfo {
    id?:number;
    state?: string;
    attempted?: boolean;
    photoUrls?: string[];
    succeeded?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    stopId?:number;
}