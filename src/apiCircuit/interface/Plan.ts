import type { IDriverApi } from './DriverApi';

export interface IPlan {
    id?: number;
    id_router_api?: string;
    title?: string;
    drivers?: IDriverApi[];
    createdAt?: Date;
    updatedAt?: Date;
    starts_day?: number;
    starts_month?: number;
    starts_year?: number;
}

export interface responsePlans {
    plans: IPlan[];
    nextPageToken: string;
}
export interface IPlanCreate {
    title?: string;
    starts?: {
        day?: number;
        month?: number;
        year?: number;
    };
    drivers?: string[];
}

export interface IResponseCreatePlan {
    id?: string;
    title?: string;
    starts?: {
        day?: number;
        month?: number;
        year?: number
    };
    depot?: string;
    distributed?: boolean;
    writable?: boolean;
    optimization?: string;
    drivers?: [
        {
            id?: string;
            name?: string;
            email?: string;
            phone?: string;
            displayName?: string;
            active?: boolean;
            depots?: string[];
            routeOverrides?: {
                startTime?: {
                    hour?: number;
                    minute?: number;
                };
                endTime?: {
                    hour?: number;
                    minute?: number;
                };
                startAddress?: {
                    address?: string;
                    addressLineOne?: string;
                    addressLineTwo?: string;
                    latitude?: number;
                    longitude?: number;
                    placeId: string;
                    placeTypes?: string[];
                };
                endAddress?: {
                    address?: string;
                    addressLineOne?: string;
                    addressLineTwo?: string;
                    latitude?: number;
                    longitude?: number;
                    placeId?: string;
                    placeTypes?: string[];
                };
                maxStops?: number;
                drivingSpeed?: string;
                deliverySpeed?: string;
                vehicleType?: string;
            }
        }
    ];
    routes: string[];
}

export interface IResponseOptimizePlan {
    id: string;
    type: string;
    done: boolean;
}