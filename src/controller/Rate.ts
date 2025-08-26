import { create, update, list, byField } from "./crudController";
import { Rate } from "../models/Rate";
import { Request, Response } from "express";
import { now } from "mongoose";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";

export const createRate = async (req: Request, res: Response) => {
    const rate = await create(Rate, req.body);
    if (!rate) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(rate);
}

export const updateRate = async (req: Request, res: Response) => {
    const rate = await update(Rate,{id: req.body.id}, req.body);
    if (!rate) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(200).json(rate);
}

export const disableRate = async (req: Request, res: Response) => {
    const {id} = req.params;
        const driver = await update(Rate, { id: id }, {state: "inactive", updateAt:now()});
        if (!driver) {
            res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
            return;
        }
        res.status(200).json(driver);
    
}

export const getRates= async (req: Request, res: Response)=>{
     const rate = await list(Rate);
        if (!rate) {
            res.status(500).json({ message: 'error al cargar los datos' })
            return;
        }
        res.status(200).json(rate);
}

interface FilterQuery {
    limit?: number;
    page?: number;
    order?: string;
    search?: string;
    comunaId?: number;
}
export const getRatesByAdmin= async (req: Request<{}, {}, {}, FilterQuery>, res: Response)=>{
     const { order, search, comunaId } = req.query;
        const limit = Number(req.query.limit) || 5;
        const page = Number(req.query.page) || 1;
        const offset = page ? (page - 1) * limit : 0;
        const [field, direction] = order ? order.split('_') : 'id_ASC'.split('_');
        const field2 = field === "creation" ? 'createAt' : field;
        let filter: WhereOptions = {};
        try {
            if (search && search.trim()) {
                filter = { nameService : { [Op.iLike]: `${search}%` } };
            }
            const { rows: rates, count } = await Rate.findAndCountAll({
                where: filter,
                limit: limit,
                offset: offset,
                order: [[field2, direction]]
            });
            if (!rates) {
                res.status(500).json({ message: 'error al cargar los datos' })
                return;
            }
            res.status(200).json({count, rates});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error al cargar los datos' })
        }
}

export const getRateById = async (req: Request, res: Response) => {
    const { id } = req.params;
     const rate = await byField(Rate,{id:id});
    if (!rate) {
        res.status(500).json({ message: 'no se pudieron cargar los datos, revisa la consola' })
        return;
    }
    res.status(200).json(rate.dataValues);
}