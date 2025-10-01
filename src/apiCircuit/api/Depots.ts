import api from './axios';
import { IDepot } from '../interface';

export const getDepots =(pageToken:string)=>{
    const query= pageToken?`?pageToken=${pageToken}`:'';
   return <Promise<IDepot[]>> api.get(`/depots${query}`);
}