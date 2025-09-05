import { create, update, list, byField, listWithRelations } from "./crudController";
import { Comuna, Driver, PickUp, Sell, Stop, User } from "../models";
import { Request, Response } from "express";
import { Sequelize, WhereOptions } from "sequelize";
import { Op } from "sequelize";

export const createPickUp = async (req: Request, res: Response) => {
    const pickUp = await create(PickUp, req.body);
    if (!pickUp) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(pickUp)
}

interface FilterQuery {
    limit?: number;
    page?: number;
    order?: string;
    search?: string;
}
export const getPickUp = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { order, search } = req.query;
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const offset = page ? (page - 1) * limit : 0;
    const [field, direction] = order ? order.split('_') : 'id_ASC'.split('_');
    const field2 = field === "creation" ? 'createAt' : field;
    let filter: WhereOptions = {};
    try {
        if (search && search.trim()) {
            filter[Op.or] = [
                { '$User.firstName$': { [Op.iLike]: `${search}%` } },
                { '$Sell.name$': { [Op.iLike]: `${search}%` } },
                { '$User.lastName$': { [Op.iLike]: `${search}%` } }
            ];
        }
        const { rows: pickUp, count } = await PickUp.findAndCountAll({
            where: filter,
            limit: limit,
            offset: offset,
            order: [[field2, direction]],
            include: [{
                model: Driver,
                attributes: ['patente'],
                required: true,
                include: [{ model: User, attributes: ['firstName', 'lastName', 'phone', 'email'], required: true }]
            }, {
                model: Sell,
                attributes: ['name', 'addresPickup'],
                required: true,
                include: [{ model: Comuna, attributes: ['name'] },
                { model: User, attributes: ['phone', 'email'], required: true }]
            }, {
                model: Stop,
                attributes: ['addresName', 'addres', 'buyOrder', 'status', 'phone'],
                required: true,
                include: [{ model: Comuna, attributes: ['name'] }]
            }]
        });
        if (!pickUp) {
            res.status(500).json({ message: 'error al cargar los datos' })
            return;
        }
        res.status(200).json({ count, pickUp });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error al cargar los datos' })
    }
    const pickUp = await listWithRelations(PickUp, req.body);
    if (!pickUp) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(pickUp)
}

export const chartsPickUpDriver = async (req: Request, res: Response) => {
    const payments = await list(PickUp, {
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('PickUp.id')), 'value'], // Conteo de IDs
            [Sequelize.col('Driver->User.firstName'), 'label']
        ],
        group: ['PickUp.id', 'Driver->User.firstName'],
        raw: true, // Devuelve resultados como objetos planos
        include: [{
            model: Driver, attributes: [], required: true,
            include: [{ model: User, attributes: [], required: true }]
        }]
    });
    if (!payments) {
        res.status(500).json({ message: 'no fue cargar los datos, revisa la consola' })
        return;
    }
    const datosLimpios = payments.map(({ label, value }) => ({
        label,
        value
    }));
    res.status(200).json(datosLimpios);
}