import { Request, Response } from "express";
import { Op, Sequelize, WhereOptions } from "sequelize";
import { Comuna, Driver, Failed, Sell, Stop, User } from "../models";
import { list } from "./crudController";

interface FilterQuery {
    limit?: number;
    page?: number;
    order?: string;
    search?: string;
}

export const getFailed = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
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
                { '$Driver->User.firstName$': { [Op.iLike]: `${search}%` } },
                { '$Sell.name$': { [Op.iLike]: `${search}%` } },
                { '$Driver->User.lastName$': { [Op.iLike]: `${search}%` } }
            ];
        }
        const { rows: failed, count } = await Failed.findAndCountAll({
            where: filter,
            limit: limit,
            offset: offset,
            order: [[field2, direction]],
            include: [{
                model:Comuna, attributes: ['name'], required: false
            },{
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
        if (!failed) {
            res.status(500).json({ message: 'error al cargar los datos' })
            return;
        }
        res.status(200).json({ count, failed });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error al cargar los datos' })
    }

}

export const chartsFailedDriver = async (req: Request, res: Response) => {
    const payments = await list(Failed, {
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('Failed.id')), 'value'], // Conteo de IDs
            [Sequelize.col('Driver->User.firstName'), 'label']
        ],
        group: ['Failed.id', 'Driver->User.firstName'],
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