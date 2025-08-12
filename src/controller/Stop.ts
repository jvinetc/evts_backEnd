import { Request, Response } from "express";
import { Stop } from "../models/Stop";
import { create, update, list, byField, byFieldWithRelations, remove, listWithRelations } from "./crudController";
import { model } from "mongoose";
import { Comuna, Rate, Sell } from "../models";
import { formatResponse } from '../util/util'
import { IStop } from "../interface/Stop";
import axios from "axios";
export const createStop = async (req: Request, res: Response) => {
    const stop = await create(Stop, req.body);
    if (!stop) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(stop);
}

export const updateStop = async (req: Request, res: Response) => {
    const stop = await update(Stop, { id: req.body.id }, req.body);
    if (!stop) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(200).json(stop);
}

export const disableStop = async (req: Request, res: Response) => {
    const stop = await remove(Stop, { id: req.body.id });
    if (!stop) {
        res.status(500).json({ message: 'no fue posible eliminar, revisa la consola' })
        return;
    }
    res.status(200).json(stop);

}

export const listStops = async (req: Request, res: Response) => {
    const stops = await listWithRelations(Stop, [
        { model: Comuna, attributes: ['name', 'id'] },
        { model: Rate, attributes: ['id', 'nameService', 'price'] },
        { model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'] }]);
    if (!stops) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(formatResponse(true, stops, 'Listado de paradas para administrador', false));
}

export const listStopByUSer = async (req: Request, res: Response) => {
    const { sellId } = req.params;
    const stops = await byFieldWithRelations(Stop, { sellId: sellId }, [
        { model: Comuna, attributes: ['name', 'id'] },
        { model: Rate, attributes: ['id', 'nameService', 'price'] },
        { model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'] }
    ]);
    if (!stops) {
        res.status(500).json({ message: 'Aun no tienes paradas creadas' })
        return;
    }
    res.status(201).json(formatResponse(true, stops, 'El listado de tus paradas', false));
}

export const addFromExcel = async (req: Request, res: Response) => {
    try {
        const resp = await Stop.bulkCreate(req.body);
        res.status(201).json(resp);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const processPay = async (req: Request, res: Response) => {
    const { selectedStops, amount, sessionId } = req.body;
    const baseUrl = process.env.BASE_URL;
    try {
        const buyOrder = `BO-${Date.now()}`;
        await Promise.all(
            selectedStops.map(async (stop: IStop) => {
                await update(Stop, { id: stop.id }, { buyOrder: buyOrder })
                    .catch(error => console.log(error));
            }));
        const { data } = await axios.post(`${baseUrl}/payments`, { amount, sessionId, buyOrder });
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}