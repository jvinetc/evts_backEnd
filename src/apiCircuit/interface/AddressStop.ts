export interface IAddressStop {
    id?: number;
    addressName?: string; //display de direccion
    addressLineOne?: string; //direccion
    addressLineTwo?: string; //comuna
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    externalId?: string;
    email?: string;
    phone?: string;
    name?: string;
    stopApiId?:number;    
    createdAt?: Date;
    updatedAt?: Date;
}