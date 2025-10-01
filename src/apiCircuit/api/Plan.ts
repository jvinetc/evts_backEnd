import api from './axios';
import { IPlan } from '../interface';
import { IPlanCreate, IResponseCreatePlan, IResponseOptimizePlan, responsePlans } from '../interface/Plan';

export const createPlan = (plan: IPlanCreate) =>{
    return api.post<IResponseCreatePlan>('/plans', plan);
}

export const getPlans = ({ pageToken, maxPageSize, startsGte, startsLte }: 
    { pageToken?: string, maxPageSize?: number, startsGte?: string, startsLte?: string }) => {
    let query = pageToken ? `pageToken=${pageToken}&` : '';
    query += maxPageSize ? `maxPageSize=${maxPageSize}&` : '';
    query += startsGte ? `filter.startsGte=${startsGte}&` : ''; //desde
    query += startsLte ? `filter.startsLte=${startsLte}&` : ''; //hasta
    return api.get<responsePlans>(`/plans?${query}`);
}

export const getPlanById = (planId: string) =>{
    return <Promise<IPlan>>api.get(`/${planId}`);
}

export const updatePlan = (planId: string, plan: IPlan) =>{
    return <Promise<IPlan>>api.put(`/${planId}`, plan);
}

export const deletePlan = (planId: string) =>{
    return <Promise<void>>api.delete(`/${planId}`);
}

export const optimizePlan = (planId: string) =>{
    return api.post<IResponseOptimizePlan>(`/${planId}:optimize`);
}

export const distributePlan = (planId: string) =>{
    return api.post<IResponseCreatePlan>(`/${planId}:distribute`);
}   