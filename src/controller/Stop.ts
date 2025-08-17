import { Request, Response } from "express";
import { Stop } from "../models/Stop";
import { create, update, list, byField, byFieldWithRelations, remove, listWithRelations } from "./crudController";
import { model } from "mongoose";
import { Comuna, Rate, Sell, Payment } from "../models";
import { formatResponse } from '../util/util'
import { IStop } from "../interface/Stop";
import xlsx from 'xlsx';
import axios from "axios";
import { registerMiddleware } from "../middleware/User";
import { IComuna } from "../interface/Comuna";
import { where } from "sequelize";
const baseUrl = process.env.BASE_URL || '';

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
                sellId: Number(sellId) || undefined,
                rateId: 1
            }
        }
        ));
        console.log(processed)
        await Stop.bulkCreate(processed as any[]);
        res.status(201).json({ message: 'Paradas creadas exitosamente' });

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

export const generateTemplate = async (req: Request, res: Response) => {
    try {
        const headers = ['direccion', 'cliente', 'comuna', 'telefono', 'referencias', 'frágil', 'devolución'];
        const defaultRows = ['', '', '', '', '', false, false];
        const worksheet = xlsx.utils.aoa_to_sheet([headers, defaultRows]);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Template');

        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename=Plantilla_Stops.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

export const getPaysBySell = async (req: Request, res: Response) => {
    const { sellId } = req.params;
    try {
        const payments = await list(Payment, {where: {sellId} });
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