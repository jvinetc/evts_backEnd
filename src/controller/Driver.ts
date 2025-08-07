import { Request, Response } from "express";
import { Driver } from "../models";
import { create, update, list, byField } from "./crudController";
import { IDriver } from "../interface/Driver";

export const createDriver = async (req: Request, res: Response) => {
    const data:IDriver = req.body; 
    const driver = await create(Driver, data);
    if (!driver) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(driver);
}

export const updateDriver = async (req: Request, res: Response) => {
    const body = req.body;
    const driver = await update(Driver, { id: body.id }, body);
    if (!driver) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(driver);
}

export const disableDriver = async (req: Request, res: Response) => {
    const driver = await update(Driver, { id: req.body.id }, { status: "inactive" });
    if (!driver) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(driver);
}

export const getDrivers = async (req: Request, res: Response) => {
    const driver = await list(Driver);
    if (!driver) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(driver);
}