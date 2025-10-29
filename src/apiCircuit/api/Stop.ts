import api from './axios';
import { IStopApi } from '../interface';
import { IResponseBulk, IStopCreate, IStopsResponse } from '../interface/Stop';

export const getStops = ({ pageToken, maxPageSize, planId, externalId }: 
    { pageToken?: string, maxPageSize?: number, planId: string, externalId?: string }) => {
    let query = pageToken ? `pageToken=${pageToken}&` : '';
    query += maxPageSize ? `maxPageSize=${maxPageSize}&` : '';
    query += externalId ? `filter.externalId=${externalId}&` : '';
    return api.get<IStopsResponse>(`/${planId}?${query}`);
}

export const getStopById = (stopId: string) => {
    return <Promise<IStopApi>>api.get(`/${stopId}`);
}

export const createStop = (stop: IStopApi, planId: string) => {
    return <Promise<IStopApi>>api.post(`/${planId}/stops`, stop);
}

export const createBulkStops = (stops?: IStopCreate[], planId?: string) => {
    return api.post<IResponseBulk>(`/${planId}/stops:import`, stops);
}

export const updateStop = (stopId: string, stop: IStopApi) => {
    return <Promise<IStopApi>>api.put(`/${stopId}`, stop);
}

export const deleteStop = (stopId: string) => {
    return <Promise<void>>api.delete(`/${stopId}`);
}