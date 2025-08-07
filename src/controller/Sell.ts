import { create, update, list, byField, byFieldWithRelations } from "./crudController";
import { Comuna, Sell } from "../models";
import { Request, Response } from "express";
import { ISell } from "../interface/Sell";

export const createSell = async (req: Request, res: Response) => {
    const sell = await create(Sell, req.body);
    if (!sell) {
        res.status(500).json({ message: 'No fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(sell.dataValues);
}

export const updateSell = async (req: Request, res: Response) => {
    const rate = await update(Sell, { id: req.body.id }, req.body);
    if (!rate) {
        res.status(500).json({ message: 'no fue posible actualizar, revisa la consola' })
        return;
    }
    res.status(201).json(rate);
}

export const disableSell = async (req: Request, res: Response) => {
    const sell = await update(Sell, { id: req.body.id }, { state: "inactive", updateAt: new Date() });
    if (!sell) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(sell);

}

export const getSell = async (req: Request, res: Response) => {
    const sell = await list(Sell);
    if (!sell) {
        res.status(500).json({ message: 'error al cargar los datos' })
        return;
    }
    res.status(201).json(sell);
}

export const getSellByUser = async (req: Request, res: Response) => {
    const { idUser } = req.params;
    const sell = await byFieldWithRelations(Sell, { userId: idUser },[
                { model: Comuna, attributes: ['name'] }
            ]);
    if (!sell) {
        res.status(400).json({ message: 'Aun no posee tiendas asociadas' })
        return;
    }
    res.status(201).json(sell);

}