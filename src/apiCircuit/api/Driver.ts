import api from './axios';
import { IDriverApi, IDriverCreate, IDriverResponse, IResponseCreateDriver } from '../interface/DriverApi';

export const getDrivers = ({ pageToken, maxPageSize }: { pageToken?: string, maxPageSize?: number }) => {
    let query = pageToken ? `?pageToken=${pageToken}` : '';
    query += maxPageSize ? `&maxPageSize=${maxPageSize}` : '';
    return api.get<IDriverResponse>(`/drivers${query}`);
}

export const getDriverById = (driverId: string) => {
    return api.get(`/${driverId}`);
}

export const createDriver = (driver: IDriverApi) => {
    return api.post<IResponseCreateDriver>('/drivers', driver);
}

export const createBulkDrivers = (drivers: IDriverApi[]) => {
    return <Promise<IDriverApi[]>>api.post('/drivers:importar', drivers);
}

export const deleteDriver = (driverId: string, driver: IDriverApi) => {
    return <Promise<IDriverApi>>api.delete(`/${driverId}`);
}

export const updateDriver = (driverId: string, driver: IDriverApi) => {
    return <Promise<IDriverApi>>api.put(`/${driverId}`, driver);
}