import { create, update, list, byField } from "./crudController";
import { Rate } from "../models/Rate";
import { Request, Response } from "express";
import { now } from "mongoose";

export const createRate = async (req: Request, res: Response) => {
    const rate = await create(Rate, req.body);
    if (!rate) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(rate);
}

export const updateRate = async (req: Request, res: Response) => {
    const rate = await update(Rate,{_id: req.body.id}, req.body);
    if (!rate) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(rate);
}

export const disableRate = async (req: Request, res: Response) => {
    
        const driver = await update(Rate, { _id: req.body.id }, {state: "inactive", updateAt:now()});
        if (!driver) {
            res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
            return;
        }
        res.status(201).json(driver);
    
}

export const getRates= async (req: Request, res: Response)=>{
     const rate = await list(Rate);
        if (!rate) {
            res.status(500).json({ message: 'error al cargar los datos' })
            return;
        }
        res.status(201).json(rate);
}