import { getPlans } from "../api/Plan";
import { Request, Response } from "express";
import { findOne } from "./crud";
import { IPlan } from "../interface";
import { Plan } from "../models";

interface FilterQuery {
    pageToken?: string;
    maxPageSize?: number;
    startsGte?: string;
    startsLte?: string;
}
export const listPlans = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { pageToken, maxPageSize, startsGte, startsLte } = req.query;
    try {
        const response = await getPlans({ pageToken, maxPageSize, startsGte, startsLte });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const findPlan = async(req: Request, res: Response)=>{
    const {day, month, year} = req.body;
    try {
        const plan = await findOne<IPlan>(Plan, {
            starts_day: day,
            starts_month: month,
            starts_year: year
        });
        res.status(200).json(plan)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}