import { create, update, list, byField, byFieldWithRelations } from "./crudController";
import { Comuna, Sell, User } from "../models";
import { Request, Response } from "express";
import { ISell } from "../interface/Sell";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";

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
interface FilterQuery {
    limit?: number;
    page?: number;
    order?: string;
    search?: string;
    comunaId?: number;
}
export const getSell = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { order, search, comunaId } = req.query;
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const offset = page ? (page - 1) * limit : 0;
    const [field, direction] = order ? order.split('_') : 'id_ASC'.split('_');
    const field2 = field === "creation" ? 'createAt' : field;
    let filter: WhereOptions = {};
    try {
        if (search && search.trim()) {
            filter[Op.or] = [
                { name: { [Op.iLike]: `${search}%` } },
                { '$User.firstName$': { [Op.iLike]: `${search}%` } },
                { '$User.lastName$': { [Op.iLike]: `${search}%` } },
                { addres: { [Op.iLike]: `${search}%` } }
            ];
        }
        const { rows: sells, count } = await Sell.findAndCountAll({
            where: filter,
            limit: limit,
            offset: offset,
            order: [[field2, direction]],
            include: [
                { model: Comuna, attributes: ['name', 'id'] },
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'id', 'phone'],
                    required: true
                }
            ]
        });
        if (!sells) {
            res.status(500).json({ message: 'error al cargar los datos' })
            return;
        }
        res.status(200).json({count, sells});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error al cargar los datos' })
    }
}

export const getSellByUser = async (req: Request, res: Response) => {
    const { idUser } = req.params;
    const sell = await byFieldWithRelations(Sell, { userId: idUser }, [
        { model: Comuna, attributes: ['name'] }
    ]);
    if (!sell) {
        res.status(400).json({ message: 'Aun no posee tiendas asociadas' })
        return;
    }
    res.status(201).json(sell);

}