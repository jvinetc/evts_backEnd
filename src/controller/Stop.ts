import { Request, Response } from "express";
import { Stop } from "../models/Stop";
import { create, update, list, byField, byFieldWithRelations, remove, listWithRelations, oneByFieldWithRelations } from "./crudController";
import { model } from "mongoose";
import { Comuna, Rate, Sell, Payment, Driver, User, Failed } from "../models";
import { formatResponse } from '../util/util'
import { IStop } from "../interface/Stop";
import xlsx from 'xlsx';
import axios from "axios";
import { registerMiddleware } from "../middleware/User";
import { IComuna } from "../interface/Comuna";
import { Sequelize, where, WhereOptions } from "sequelize";
import dayjs from "dayjs";
import { Op } from "sequelize";
import { IDriver } from "../interface/Driver";
import { createNotification, sendPushNotification } from "./Notification";
import { ISell } from "../interface/Sell";
import { IRate } from "../interface/Rate";
const baseUrl = process.env.BASE_URL || '';

export const createStop = async (req: Request, res: Response) => {
    const {
        addresName,
        addres,
        comunaId,
        notes,
        sellId,
        phone,
        lat,
        lng,
        fragile,
        devolution,
        exchange,
        selectedRates,
    } = req.body;
    const selectedR: IRate[] = selectedRates || [];

    const totalStop = selectedR.reduce((acc, rate) => acc + Number(rate.price), 0);
    const rateIds: number[] = selectedR
        .map(rate => rate.id)
        .filter((id): id is number => id !== undefined);
    const newStop: Partial<IStop> = {
        addresName,
        addres,
        comunaId,
        notes,
        sellId,
        ratesIds: rateIds.length > 0 ? rateIds : undefined,
        phone,
        lat,
        lng,
        fragile,
        devolution,
        exchange,
        totalStop
    }
    const stop = await create(Stop, newStop);
    if (!stop) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    try {
        /* await createNotification({
            type: 'admin', sellId: req.body.sellId, title: 'Nueva parada creada',
            message: 'Nueva parada agregada, pendiente de pago',
        }); */

        res.status(201).json(stop);
    } catch (error) {
        console.log(error);
    }

}

export const updateStop = async (req: Request, res: Response) => {
    const {
        id,
        addresName,
        addres,
        comunaId,
        notes,
        sellId,
        phone,
        lat,
        lng,
        fragile,
        devolution,
        exchange,
        selectedRates,
    } = req.body;
    const selectedR: IRate[] = selectedRates || [];

    const totalStop = selectedR.reduce((acc, rate) => acc + Number(rate.price), 0);
    const rateIds: number[] = selectedR
        .map(rate => rate.id)
        .filter((id): id is number => id !== undefined);
    const updateStop: Partial<IStop> = {
        addresName,
        addres,
        comunaId,
        notes,
        sellId,
        ratesIds: rateIds.length > 0 ? rateIds : [],
        phone,
        lat,
        lng,
        fragile,
        devolution,
        exchange,
        totalStop
    }
    const stop = await Stop.update(updateStop, { where: { id } });
    if (!stop) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(200).json(stop);
}

export const getStopById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const stop = await oneByFieldWithRelations(Stop, { id: id }, [
        { model: Comuna, attributes: ['name', 'id'] }
    ]);
    if (!stop) {
        res.status(500).json({ message: 'no fue posible cargar la informacion, revisa la consola' })
        return;
    }
    const rates: IRate[] = stop.dataValues.ratesIds
        ? await Promise.all(
            stop?.dataValues.ratesIds.map(async (rateId: number) => {
                const rate = await Rate.findOne({ where: { id: rateId } });
                return rate?.dataValues as IRate;
            })
        )
        : [];
    res.status(200).json({ stop: stop.dataValues, rates });
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
    const stops = await listWithRelations(Stop, { where: { [Op.or]: [{ status: 'pickUp' }, { status: 'delivery' }] } }, [
        { model: Comuna, attributes: ['name', 'id'] },
        {
            model: Sell, attributes: ['id', 'name', 'email', 'addresPickup', 'lat', 'lng'],
            include: [
                { model: Comuna, attributes: ['name', 'id'] }
            ]
        },
        {
            model: Driver, attributes: ['id', 'userId', 'patente'],
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'id']
                }
            ]
        }
    ]);
    if (!stops) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(stops);
}

export const listStopsToMap = async (req: Request, res: Response) => {
    const stops = await listWithRelations(Stop, { where: { [Op.or]: [{ status: 'pickUp' }, { status: 'delivery' }] } }, [
        { model: Comuna, attributes: ['name', 'id'] },
        {
            model: Sell, attributes: ['id', 'name', 'email', 'addresPickup', 'lat', 'lng'],
            include: [
                { model: Comuna, attributes: ['name', 'id'] }
            ]
        },
        {
            model: Driver, attributes: ['id', 'userId', 'patente'],
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'id', 'email']
                }
            ]
        }
    ]);
    if (!stops) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }

    res.status(201).json(stops);
}

interface FilterQuery {
    limit?: number;
    page?: number;
    order?: string;
    search?: string;
    comunaId?: number;
}

export const listStopsDelivered = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { order, search } = req.query;
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const offset = page ? (page - 1) * limit : 0;
    const [field, direction] = order ? order.split('_') : 'id_ASC'.split('_');
    const field2 = field === "creation" ? 'createAt' : field;
    let filter: WhereOptions = { status: 'delivered' };
    if (search && search.trim()) {
        filter[Op.or] = [
            { '$Sell.name$': { [Op.iLike]: `${search}%` } },
            { '$Comuna.name$': { [Op.iLike]: `${search}%` } },
            { addres: { [Op.iLike]: `${search}%` } }
        ];
    }
    try {
        const { rows: stops, count } = await Stop.findAndCountAll({
            where: filter,
            limit: limit,
            offset: offset,
            order: [[field2, direction]],
            include: [
                { model: Comuna, attributes: ['name', 'id'], required: true },
                {
                    model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'],
                    required: true,
                    include: [
                        { model: Comuna, attributes: ['name', 'id'] }
                    ]
                },
                {
                    model: Driver, attributes: ['id', 'userId', 'patente'],
                    required: true,
                    include: [
                        {
                            model: User,
                            attributes: ['firstName', 'lastName', 'id', 'email'],
                            required: true
                        }
                    ]
                }
            ]
        });

        res.status(200).json({ stops, count });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
    }

}
export const listStopsFailed = async (req: Request, res: Response) => {
    const stops = await listWithRelations(Stop, { where: { status: 'failed' } }, [
        { model: Comuna, attributes: ['name', 'id'] },
        {
            model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'],
            include: [
                { model: Comuna, attributes: ['name', 'id'] }
            ]
        },
        {
            model: Driver, attributes: ['id', 'userId', 'patente'],
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'id', 'email']
                }
            ]
        }
    ]);
    if (!stops) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(stops);
}

export const listStopsPending = async (req: Request, res: Response) => {
    const stops = await listWithRelations(Stop, { where: { status: 'to_be_paid' } }, [
        { model: Comuna, attributes: ['name', 'id'] },
        {
            model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'],
            include: [
                { model: Comuna, attributes: ['name', 'id'] }
            ]
        },
        {
            model: Driver, attributes: ['id', 'userId', 'patente'],
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'id', 'email']
                }
            ]
        }
    ]);
    if (!stops) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(stops);
}

type ResponseChart = {
    label: string;
    value: number;
}
export const listStopsCharts = async (req: Request, res: Response) => {
    const stops = await list(Stop, {
        attributes: [
            [Sequelize.literal(`"createAt"::date`), 'label'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'value'] // Conteo de IDs
        ],
        group: [Sequelize.literal(`"createAt"::date`)],
        raw: true // Devuelve resultados como objetos planos
    });
    if (!stops) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    const datosLimpios = stops.map(({ label, value }) => ({
        label: dayjs(label).format('DD-MM-YYYY'), // o 'YYYY-MM-DD', según lo que necesites
        value
    }));
    res.status(200).json(datosLimpios);
}

export const listStopsComunas = async (req: Request, res: Response) => {
    const stops = await listWithRelations(Stop, {
        attributes: [
            'comunaId',
            [Sequelize.fn('COUNT', Sequelize.col('Stop.id')), 'value'], // Conteo de IDs
            [Sequelize.col('Comuna.name'), 'label']
        ],
        group: ['comunaId', 'Comuna.name', 'Comuna.id'],
        raw: true // Devuelve resultados como objetos planos
    },
        [{ model: Comuna, attributes: [], required: true }]);
    if (!stops) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    const datosLimpios = stops.map(({ label, value }) => ({
        value,
        label
    }));
    res.status(200).json(datosLimpios);
}

export const listStopByUSer = async (req: Request, res: Response) => {
    const { sellId } = req.params;

    const stops = await byFieldWithRelations(Stop, { sellId }, [
        { model: Comuna, attributes: ['name', 'id'] },
        { model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'] }
    ]);

    if (!stops) {
        res.status(500).json({ message: 'Aún no tienes paradas creadas' });
        return;
    }

    const stps: IStop[] = stops.map(s => s.dataValues);

    const response = await Promise.all(
        stps.map(async s => {
            const rates: IRate[] = s.ratesIds
                ? await Promise.all(
                    s.ratesIds.map(async (rateId: number) => {
                        const rate = await Rate.findOne({ where: { id: rateId } });
                        return rate?.dataValues as IRate;
                    })
                )
                : [];

            return {
                stop: s,
                rates
            };
        })
    );
    res.status(200).json(formatResponse(true, response, 'El listado de tus paradas', false));
};


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
    const { selectedStops, amount, sessionId, returnUrl } = req.body;
    const baseUrl = process.env.BASE_URL;
    try {
        const buyOrder = `BO-${Date.now()}`;
        await Promise.all(
            selectedStops.map(async (stop: IStop) => {
                await update(Stop, { id: stop.id }, { buyOrder: buyOrder })
                    .catch(error => console.log(error));
            }));
        const { data } = await axios.post(`${baseUrl}/payments`, { amount, sessionId, buyOrder, returnUrl });
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

interface ExcelRow {
    direccion?: string;
    cliente?: string;
    comuna?: string;
    telefono?: number;
    referencias?: string;
    frágil?: boolean;
    devolución?: boolean;
    cambio?: boolean;
}

const validateExcelData = (data: ExcelRow[]): ExcelRow[] => {
    return data.filter(row =>
        row.direccion?.trim() &&
        row.cliente?.trim() &&
        row.comuna?.trim() &&
        typeof row.telefono === 'number'
    );
};

export const createFromExcel = async (req: Request, res: Response) => {
    try {
        const buffer = req.file?.buffer;
        const { sellId } = req.params;
        if (!buffer) {
            console.log('No se ha subido ningun archivo');
            res.status(400).json({ message: 'No se ha subido ningun archivo' });
            return;
        }
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const raw = xlsx.utils.sheet_to_json<ExcelRow>(workbook.Sheets[sheetName]);
        const rows = validateExcelData(raw);
        if (rows.length === 0) {
            res.status(400).json({ message: 'El archivo no contiene datos válidos' });
            console.log('El archivo no contiene datos válidos');
            return;
        }
        const processed: IStop[] = await Promise.all(raw.map(async (row) => {
            const { data } = await axios.post(`${baseUrl}/autocomplete/${row.direccion}, ${row.comuna}`);
            // Assert the type of 'data' to access its properties
            const suggestions = (data as { data: { suggestions: any[] } }).data.suggestions;
            const placeId = suggestions[0].placePrediction.placeId;

            const { data: detail } = await axios.get(`${baseUrl}/autocomplete/detail/${placeId}`);
            const { streetName, streetNumber, comuna, lat, lng } = (detail as { data: { streetName: string; streetNumber: string; comuna: string; lat: number; lng: number } }).data;

            const notes = typeof row.referencias === 'string' ? row.referencias.replace(/[()]/g, '') : '';
            const phone = !row.telefono ? '' : row.telefono.toString();
            const addres = `${streetName} ${streetNumber}`;
            const comunaRecord = await byField<IComuna>(Comuna, { name: comuna });
            const comunaId = comunaRecord ? comunaRecord.id : undefined;
            return {
                addresName: row.cliente ? row.cliente : 'Sin nombre',
                addres: addres,
                comunaId: comunaId,
                notes: notes,
                phone: phone,
                lat: lat,
                lng: lng,
                fragile: row.frágil || false,
                devolution: row.devolución || false,
                exchange: row.cambio || false,
                sellId: Number(sellId) || undefined,
                rateId: 1
            }
        }
        ));
        await Stop.bulkCreate(processed as any[]);
        res.status(201).json({ message: 'Paradas creadas exitosamente' });

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

export const generateTemplate = async (req: Request, res: Response) => {
    try {
        const headers = ['direccion', 'cliente', 'comuna', 'telefono', 'referencias', 'frágil', 'devolución', 'cambio'];
        const defaultRows = ['', '', '', '', '', false, false, false];
        const worksheet = xlsx.utils.aoa_to_sheet([headers, defaultRows]);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Template');

        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename=Plantilla_Stops.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment('Plantilla_Stops.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

export const getPaysBySell = async (req: Request, res: Response) => {
    const { sellId } = req.params;
    try {
        const payments = await list(Payment, { where: { sellId } });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

export const getPayDetail = async (req: Request, res: Response) => {
    const { buyOrder } = req.params;
    try {
        const stops = await byFieldWithRelations(Stop, { buyOrder }, [
            { model: Comuna, attributes: ['name', 'id'] },
            { model: Rate, attributes: ['id', 'nameService', 'price'] },
            { model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'] }
        ]);
        res.status(200).json(stops);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }

}

export const listStopByAdmin = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { order, search, comunaId } = req.query;
    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const offset = page ? (page - 1) * limit : 0;
    const [field, direction] = order ? order.split('_') : 'id_ASC'.split('_');
    const field2 = field === "creation" ? 'createAt' : field;
    let filter: WhereOptions = {};
    if (search && search.trim()) {
        filter[Op.or] = [
            { addresName: { [Op.iLike]: `${search}%` } },
            { '$Sell.name$': { [Op.iLike]: `${search}%` } },
            { addres: { [Op.iLike]: `${search}%` } }
        ];
    }

    const { rows: stops, count } = await Stop.findAndCountAll({
        where: filter,
        limit: limit,
        offset: offset,
        order: [[field2, direction]],
        include: [
            { model: Comuna, attributes: ['name', 'id'] },
            { model: Rate, attributes: ['id', 'nameService', 'price'] },
            {
                model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'],
                include: [
                    { model: Comuna, attributes: ['name', 'id'] }
                ]
            },
            {
                model: Driver, attributes: ['id', 'userId', 'patente'],
                include: [
                    {
                        model: User,
                        attributes: ['firstName', 'lastName', 'id', 'email']
                    }
                ]
            }
        ]
    });
    if (!stops) {
        res.status(500).json({ message: 'Error al cargar su listado' })
        return;
    }
    res.status(200).json({ stops, count });
}

export const asignDriversToStops = async (req: Request, res: Response) => {
    try {
        const stops = await list(Stop, {
            where: {
                [Op.or]: [
                    { status: 'pickUp' },
                    { status: 'delivery' }
                ]
            },
            include: [
                {
                    model: Sell, attributes: ['comunaId']
                }
            ]
        });

        if (!stops) {
            res.status(400).json({ message: 'No hay paradas para asignar a conductor' });
            return;
        }
        let driv: IDriver[] = [];
        let countPickUp: number = 0;
        let sells: number[] = [];
        await Promise.all(stops.map(async (s) => {
            const stop = s.dataValues;
            let condition: {} = {};
            if (stop.status === 'pickUp') {
                condition = { id: stop.Sell.comunaId }
            } else if (stop.status === 'delivery') {
                condition = { id: stop.comunaId };
            }

            const driver = await Driver.findOne({
                include: [
                    {
                        model: Comuna,
                        attributes: ['name', 'id'],
                        required: true,
                        where: condition
                    }
                ]
            });
            if (driver) {
                await update(Stop, { id: Number(stop.id) }, { driverId: Number(driver.dataValues.id) });
            }
        })
        )

        const st = await list(Stop)
        res.status(200).json({ st });
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }

}


export const reDispatch = async (req: Request, res: Response) => {
    const { stop }: { stop: IStop } = req.body;
    try {
        await update(Stop, { id: Number(stop.id) }, { status: 'delivery', driverId: null });
        await update(Failed, { stopId: Number(stop.id) }, { action: 're-dispatch', updateAt: new Date() });
        res.status(200).json({ message: 'Reasignado para re-despacho' });
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

export const returnToShop = async (req: Request, res: Response) => {
    const { stop }: { stop: IStop } = req.body;
    try {
        const sell = await oneByFieldWithRelations<ISell>(Sell, { id: stop.sellId }, [
            { model: User, attributes: ['firstName', 'id', 'phone'] }
        ]);
        if (!sell) {
            res.status(400).json({ message: 'No se encontro la venta asociada a la parada' });
            return;
        }
        await update(Stop, { id: Number(stop.id) }, {
            status: 'delivery', driverId: null, addres: sell?.addresPickup,
            comunaId: sell.comunaId, lat: sell?.lat, lng: sell?.lng,
            addresName: `${sell.name}- ${sell.User?.firstName}`, phone: sell.User?.phone,
            notes: 'Devolución a la tienda', updateAt: new Date()
        });
        await update(Failed, { stopId: Number(stop.id) }, { action: 'return_to_shop', updateAt: new Date() });
        res.status(200).json({ message: 'Devuelto a la tienda' })
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

export const chartsDeliveredDay = async (req: Request, res: Response) => {
    const stops = await list(Stop, {
        attributes: [
            [Sequelize.literal(`"deliveryDate"::date`), 'label'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'value'] // Conteo de IDs
        ],
        where: { status: 'delivered' },
        group: [Sequelize.literal(`"deliveryDate"::date`)],
        raw: true // Devuelve resultados como objetos planos
    });
    if (!stops) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    const datosLimpios = stops.map(({ label, value }) => ({
        label: dayjs(label).format('DD-MM-YYYY'), // o 'YYYY-MM-DD', según lo que necesites
        value
    }));
    res.status(200).json(datosLimpios);
}

export const countDelivered = async (req: Request, res: Response) => {
    try {
        const count = await Stop.count({ where: { status: 'delivered' } });
        res.status(200).json({ count });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'no fue posible cargar los datos, revisa la consola' })
    }

}