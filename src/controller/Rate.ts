import { create, update, list, byField, remove } from "./crudController";
import { Rate } from "../models/Rate";
import { Request, Response } from "express";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { Comuna, RateAddition } from "../models";
import { IRateAddition } from "../interface/RateAddition";
import { IRate } from "../interface/Rate";

export const createRate = async (req: Request, res: Response) => {
    const { nameService, price } = req.body;
    const rate = await create(Rate, req.body);
    if (!rate) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(rate);
}

export const updateRate = async (req: Request, res: Response) => {
    const rate = await update(Rate, { id: req.body.id }, req.body);
    if (!rate) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(200).json(rate);
}

export const disableRate = async (req: Request, res: Response) => {
    const { id } = req.params;
    const driver = await update(Rate, { id: id }, { state: "inactive", updateAt: new Date() });
    if (!driver) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(200).json(driver);

}

export const getRates = async (req: Request, res: Response) => {
    const rate = await list(Rate, {
        include: [
            {
                model: RateAddition,
                attributes: ['price', 'comunaId'],
                include: [{ model: Comuna, attributes: ['name'] }]
            }
        ]
    });
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
export const getRatesByAdmin = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { order, search, comunaId } = req.query;
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const offset = page ? (page - 1) * limit : 0;
    const [field, direction] = order ? order.split('_') : 'id_ASC'.split('_');
    const field2 = field === "creation" ? 'createAt' : field;
    let filter: WhereOptions = {};
    try {
        if (search && search.trim()) {
            filter = { nameService: { [Op.iLike]: `${search}%` }, status: 'activo' };
        }
        const { rows: rates, count } = await Rate.findAndCountAll({
            where: filter,
            limit: limit,
            offset: offset,
            order: [[field2, direction]],
            include: [{
                model: RateAddition,
                include: [{ model: Comuna, attributes: ['id', 'name'] }],
            }]
        });
        if (!rates) {
            res.status(500).json({ message: 'error al cargar los datos' })
            return;
        }
        res.status(200).json({ count, rates });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error al cargar los datos' })
    }
}

export const getRateById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const rate = await byField(Rate, { id: id });
    if (!rate) {
        res.status(500).json({ message: 'no se pudieron cargar los datos, revisa la consola' })
        return;
    }
    res.status(200).json(rate.dataValues);
}

export const saveBaseRate = async (req: Request, res: Response) => {
    const { id, nameService, price, isBase, type } = req.body;
    try {
        const r = await Rate.findOne({ where: { id } });
        if (r) {
            await update(Rate, { id }, { nameService, price, isBase, type });
            res.status(200).json({ message: 'La tarifa se actualizo con éxito' })
            return;
        }
        const rate = await create(Rate, { nameService: "Tarifa Base", price, isBase: true, type: 'base' });
        if (!rate) {
            res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
            return;
        }
        res.status(200).json({ rate, message: 'Tarifa base creada con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error al guardar los datos' })
    }
}

export const saveAdditionalRateComunas = async (req: Request, res: Response) => {
    const { id, nameService, price, isBase, type, RateAdditions } = req.body;
    const rate_additions: IRateAddition[] = RateAdditions || [];

    try {
        let rate = await Rate.findOne({ where: { id } });

        if (rate) {
            // 🟢 Actualizar tarifa
            await update(Rate, { id }, { nameService, price, isBase, type });

            // 🟡 Obtener todas las RateAdditions actuales
            const existingAdditions = await RateAddition.findAll({ where: { rateId: id } }) as IRateAddition[];

            // 🔴 Detectar cuáles deben eliminarse
            const incomingIds = new Set(rate_additions.filter(ra => ra.id).map(ra => ra.id));
            const toDelete = existingAdditions.filter((ra) => !incomingIds.has(ra.id));

            // 🔴 Eliminar los que no están en el body
            await Promise.all(toDelete.map(async (ra) => {
                await remove(RateAddition, { id: ra.id });
            }));

            // 🟢 Crear o actualizar los que sí vienen
            await Promise.all(rate_additions.map(async (addition) => {
                if (addition.id) {
                    await update(RateAddition, { id: addition.id }, addition);
                } else {
                    await create(RateAddition, { ...addition, rateId: id });
                }
            }));

            res.status(200).json({ message: 'La tarifa se actualizó con éxito' });
            return;
        }

        // 🆕 Crear tarifa nueva
        rate = await create(Rate, { nameService, price, isBase: false, type: 'aditional_zone' });
        if (!rate) {
            res.status(500).json({ message: 'No fue posible guardar, revisa la consola' });
            return;
        }

        // 🟢 Crear RateAdditions nuevas
        await Promise.all(rate_additions.map(async (addition) => {
            await create(RateAddition, { ...addition, rateId: rate.dataValues.id });
        }));

        res.status(200).json(req.body);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al guardar los datos' });
    }
};

export const saveAdittionalRateSizes = async (req: Request, res: Response) => {
    const { id, nameService, price, isBase, type } = req.body;
    try {
        const i = id || 0;
        const r = await Rate.findOne({ where: { id: i } });
        if (r) {
            await update(Rate, { id }, { nameService, price, isBase, type });
            res.status(200).json({ message: 'La tarifa se actualizo con éxito' })
            return;
        }
        const rate = await create(Rate, { nameService, price, isBase: false, type: 'aditional_size' });
        if (!rate) {
            res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
            return;
        }
        res.status(200).json(req.body);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error al guardar los datos' })
    }
}
