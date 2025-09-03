import { Request, Response } from "express";
import { list } from "./crudController";
import { Comuna, Driver, Payment, Rate, Sell, Stop, User } from "../models";
import { Sequelize, WhereOptions } from "sequelize";
import dayjs from "dayjs";
import { Op } from "sequelize";

type ResponseChart = {
    label: string;
    value: number;
}
export const listPaysCharts = async (req: Request, res: Response) => {
    const payments = await list(Payment, {
        attributes: [
            [Sequelize.literal(`"createAt"::date`), 'label'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'value'] // Conteo de IDs
        ],
        group: [Sequelize.literal(`"createAt"::date`)],
        raw: true // Devuelve resultados como objetos planos
    });
    if (!payments) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    const datosLimpios = payments.map(({ label, value }) => ({
        label: dayjs(label).format('DD-MM-YYYY'), // o 'YYYY-MM-DD', según lo que necesites
        value
    }));
    res.status(200).json(datosLimpios);
}


export const listSellsPaysCharts = async (req: Request, res: Response) => {
    const payments = await list(Payment, {
        attributes: [
            'sellId',
            [Sequelize.fn('COUNT', Sequelize.col('Payment.id')), 'value'], // Conteo de IDs
            [Sequelize.col('Sell.name'), 'label']
        ],
        group: ['sellId', 'Sell.name', 'Sell.id'],
        raw: true, // Devuelve resultados como objetos planos
        include: [{ model: Sell, attibutes: [], required: true }]
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

interface FilterQuery {
    limit?: number;
    page?: number;
    order?: string;
    search?: string;
    comunaId?: number;
}

export const getPays = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { order, search, comunaId } = req.query;
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const offset = page ? (page - 1) * limit : 0;
    const [field, direction] = order ? order.split('_') : 'id_ASC'.split('_');
    const field2 = field === "creation" ? 'createAt' : field;
    let filter: WhereOptions = {};
    if (search && search.trim()) {
        filter[Op.or] = [
            { buy_order: { [Op.iLike]: `${search}%` } },
            { '$Sell.name$': { [Op.iLike]: `${search}%` } }
        ];
    }
    try {
        const { rows: payments, count } = await Payment.findAndCountAll({
        where: filter,
        limit: limit,
        offset: offset,
        order: [[field2, direction]],
            include: [
                { model: Sell, attributes: ['name', 'id'] }
            ]
        })

        let result = await Promise.all(
            payments.map(async (p) => {
                const stops = await list(Stop, {
                    where: { buyOrder: p.dataValues.buy_order }, include: [
                        { model: Comuna, attributes: ['name', 'id'] },
                        { model: Rate, attributes: ['id', 'nameService', 'price'] },
                        {
                            model: Driver, attributes: ['id', 'userId', 'patente'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['firstName', 'lastName', 'id']
                                }
                            ]
                        }
                    ]
                });
                return {
                    payment: p,
                    stops
                }
            })
        );
        res.status(200).json({result, count});
    } catch (error) {
        res.status(500).json({ message: 'no fue cargar los datos, revisa la consola' });
        console.log(error);
    }
}