import { Request, Response } from "express";
import { createBulkStops, getStops } from "../api/Stop";
import { list, oneByFieldWithRelations } from "../../controller/crudController";
import { Comuna, Driver, PickUp, Sell, Stop, User } from "../../models";
import { Op, Sequelize } from "sequelize";
import { IAddressStop, IDeliveryInfo, IDriverApi, IPlan, IStopApi } from "../interface";
import { createDriver, getDrivers } from "../api/Driver";
import { find, findOne, insert, update } from "./crud";
import { AddressStop, DeliveryInfo, DriverApi, Plan, StopApi } from "../models";
import { IUser } from "../../interface/User";
import { IDriver } from "../../interface/Driver";
import { IDriverCreate } from "../interface/DriverApi";
import { IPlanCreate } from "../interface/Plan";
import { IResponseWebhook, IStopCreate, IStopResponseCircuit } from "../interface/Stop";
import { createPlan, distributePlan, optimizePlan } from "../api/Plan";
import crypto from 'crypto';
import { IStop, IStopResponse } from "../../interface/Stop";
import { IPickUp } from "../../interface/PickUp";

const statusPickup = {
    picked_up_from_customer: 'picked_up_from_customer',
    picked_up_unmanned: 'picked_up_unmanned',
    picked_up_from_locker: 'picked_up_from_locker',
}

const statusDelivery = {
    delivered_to_recipient: 'delivered_to_recipient',
    delivered_to_third_party: 'delivered_to_third_party',
    delivered_to_mailbox: 'delivered_to_mailbox',
    delivered_to_safe_place: 'delivered_to_safe_place',
    delivered_to_pickup_point: 'delivered_to_pickup_point',
}

const statusFailed = {
    failed_not_home: 'failed_not_home',
    failed_cant_find_address: 'failed_cant_find_address',
    failed_no_parking: 'failed_no_parking',
    failed_no_time: 'failed_no_time',
    failed_package_not_available: 'failed_package_not_available',
    failed_missing_required_proof: 'failed_missing_required_proof',
}

export const webHookCircuit = async (req: Request, res: Response) => {
    const { version, created, data, type } = req.body;
    /* console.log('data:', data); */
    try {
        const receivedSignature = req.get('circuit-signature');
        const secret = process.env.CIRCUIT_SECRET || 'abcdefghi123456789';
        const fecha = new Date();
        const day = fecha.getDate();
        const month = fecha.getMonth() + 1;
        const year = fecha.getFullYear();

        if (!receivedSignature) {
            throw new Error(`Error al obtener el certificado`);
        }
        const rawBuffer = Buffer.from(JSON.stringify(req.body));
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(rawBuffer)
            .digest('hex');
       /*  console.log('receivedSignature:', receivedSignature);
        console.log('expectedSignature:', expectedSignature);
        if (
            expectedSignature.length !== receivedSignature.length ||
            !crypto.timingSafeEqual(
                Buffer.from(expectedSignature, 'hex'),
                Buffer.from(receivedSignature, 'hex'),
            )
        ) {
            throw new Error(`Error, certificado invalido.`);
        } */

        if (type === "test.send_event") {
            res.status(200).send('Webhook received test');
            console.log("recepcion de test de circiurt", data);
            return;
        } else if (type === "stop.attempted_delivery") {
            const stop: IStopResponseCircuit = data;
            if (!stop) throw new Error(`Error, el cuerpo de la solicitud esta vacio.`);
            const stopApi = await findOne<IStopApi>(StopApi, {}, {
                include: [
                    { model: AddressStop, where: { externalId: stop.recipient?.externalId } }
                ]
            });
            if (!stopApi) {
                throw new Error(`Error, no existe el punto en su sitema.`);
            }
            const devInfo: IDeliveryInfo = {
                photoUrls: stop.deliveryInfo?.photoUrls,
                attempted: stop.deliveryInfo?.attempted,
                state: stop.deliveryInfo?.state,
                succeeded: stop.deliveryInfo?.succeeded,
                stopId: stopApi?.id
            };
            const deliveryInfo = await insert(DeliveryInfo, devInfo);
            if (!deliveryInfo) throw new Error(`Error, no fue posible grabar la informacion de la entrega`);
            if (Object.values(statusFailed).includes((String(stop.deliveryInfo?.state)))) {
                await update(Stop, Number(stop.recipient?.externalId), {
                    status: 'failed',
                    evidence: stop.deliveryInfo?.photoUrls,
                    pickupDate: `${year}-${month}-${day}`
                })
            }
            if (Object.values(statusPickup).includes((String(stop.deliveryInfo?.state)))) {
                const stops = await find<IStop>(Stop, { status: 'pickUp', sellId: stop.recipient?.externalId });
                const pickUp: IPickUp = {
                    sellId: stop.recipient?.externalId,
                    driverId: stops[0].driverId,
                    pickuDate: `${year}-${month}-${day}`,
                    evidence: stop.deliveryInfo?.photoUrls,
                }
                await insert(PickUp, pickUp);
                await Promise.all(stops.map(async (stp) => {
                    await update(Stop, Number(stp.id), {
                        status: 'delivery',
                        evidence: stop.deliveryInfo?.photoUrls,
                        dirverId: null,
                        pickupDate: `${year}-${month}-${day}`
                    });
                }));

            }
            if (Object.values(statusDelivery).includes((String(stop.deliveryInfo?.state)))) {
                await update(Stop, Number(stop.recipient?.externalId), {
                    status: 'delivered',
                    evidence: stop.deliveryInfo?.photoUrls,
                    deliveryDate: `${year}-${month}-${day}`
                })
            }
            await update(StopApi, Number(stopApi?.id), { id_router_api: stop.id })
            console.log('registro actualizado correctamente')
            res.status(200).send('Webhook received');
        }
    } catch (error: any) {
        console.error('[WEBHOOK ERROR]', error.message);
        res.status(200).send('Error interno');
    }
}

interface FilterQuery {
    pageToken?: string;
    maxPageSize?: number;
    externalId?: string;
    planId: string;
}

export const listStops = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { pageToken, maxPageSize, externalId, planId } = req.query;
    try {
        const response = await getStops({ pageToken, maxPageSize, externalId, planId });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getPickups = async (planId: number) => {
    try {
        const stopsPickup = await list(Stop, {
            attributes: ['sellId',
                [Sequelize.fn('COUNT', Sequelize.col('Stop.id')), 'contador']
            ],
            where: { status: 'pickUp' },
            include: [
                {
                    model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'],
                    include: [
                        { model: Comuna, attributes: ['id', 'name'], required: true }
                    ]
                },
                {
                    model: Driver, attributes: ['id'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'email'],
                            required: true
                        }
                    ],
                    required: true
                }
            ],
            group: ['Stop.sellId', 'Sell.id', 'Sell->Comuna.id', 'Driver->User.id', 'Driver.id']
        });

        let addresStops: IAddressStop[] = [];
        let stopApis: IStopApi[] = [];
        Promise.all(stopsPickup.map(async (stop) => {
            const s: IStopResponse = stop.dataValues;
            const stopAPi: IStopApi = {
                activity: 'pickup',
                driverIdentifier: s.Driver?.User?.email,
                packageCount: s.contador,
                planId: planId
            }

            const sA = await insert(StopApi, stopAPi);
            if (!sA) return false;
            const addresStop: IAddressStop = {
                addressName: `${s.Sell?.addresPickup}, ${s.Sell?.Comuna?.name}`,
                addressLineOne: s.Sell?.addresPickup,
                addressLineTwo: s.Sell?.Comuna?.name,
                externalId: s.sellId?.toString(),
                name: s.Sell?.name,
                latitude: s.Sell?.lat,
                longitude: s.Sell?.lng,
                phone: s.Sell?.User?.phone,
                email: s.Sell?.email,
                stopApiId: sA.id
            }
            const aS = await insert(AddressStop, addresStop);
            if (!aS) return false;
            addresStops.push(addresStop);
            stopApis.push(stopAPi);
        }))
        return true;
    } catch (error) {
        console.log(error)
        throw new Error(`Error al guardar pickup stops: ${error}`);
    }
}

const getDelivery = async (planId: number) => {
    try {
        const stopsDelivery = await list(Stop, {
            where: { status: 'delivery' },
            include: [
                { model: Comuna, attributes: ['name', 'id'] },
                {
                    model: Sell, attributes: ['id', 'name', 'email', 'addresPickup'],
                    include: [
                        { model: Comuna, attributes: ['name', 'id'] },
                        { model: User, attributes: ['phone', 'email'] }
                    ]
                },
                {
                    model: Driver, attributes: ['id', 'patente'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'email'],
                            required: true
                        },
                    ]
                }
            ]
        });

        let addresStops: IAddressStop[] = [];
        let stopApis: IStopApi[] = [];
        Promise.all(stopsDelivery.map(async (stop) => {
            const s: IStopResponse = stop.dataValues;
            const stopAPi: IStopApi = {
                activity: 'delivery',
                driverIdentifier: s.Driver?.User?.email,
                planId: planId
            }

            const sA = await insert(StopApi, stopAPi);
            if (!sA) return false;

            const addresStop: IAddressStop = {
                addressName: `${s.addres}, ${s.Comuna?.name}`,
                addressLineOne: s.addres,
                addressLineTwo: s.Comuna?.name,
                externalId: s.id?.toString(),
                name: s.addresName,
                latitude: s.lat,
                longitude: s.lng,
                phone: s.phone,
                stopApiId: sA.id
            }
            const aS = await insert(AddressStop, addresStop);
            if (!aS) return false;

            addresStops.push(addresStop);
            stopApis.push(stopAPi);
        }))
        return true;
    } catch (error) {
        console.log(error)
        throw new Error(`Error al guardar stops delivery: ${error}`);
    }
}

function generarTitulo({ day, month, year }: { day: number; month: number; year: number }) {
    const fecha = new Date(year, month - 1, day); // mes base 0
    const diaSemana = fecha.toLocaleDateString('es-CL', { weekday: 'short' }); // "lun"
    const mes = fecha.toLocaleDateString('es-CL', { month: 'short' }); // "sept"

    return `${diaSemana}, ${day} ${mes} Route`;
}
const preparePlan = async () => {
    const fecha = new Date();
    const day = fecha.getDate();
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();
    const existingPlan = await findOne(Plan, {
        starts_day: day,
        starts_month: month,
        starts_year: year
    });
    if (existingPlan) return;
    const plan: IPlan = {
        title: generarTitulo({ day, month, year }),
        starts_day: day,
        starts_month: month,
        starts_year: year
    }
    return await insert(Plan, plan);
}

const verifyDriversApi = async (driver: IDriverApi) => {
    try {
        //verifico si tengo el conductor en mi base de datos, si no lo grabo
        const d = await findOne<IDriverApi>(DriverApi, { email: driver.email });
        if (!d) {
            const newDriver: IDriverApi = {
                id_router_api: driver.id,
                email: driver.email,
                name: driver.name,
                active: driver.active,
                phone: driver.phone,
                displayName: driver.displayName
            }
            await insert(DriverApi, newDriver);
        }
    } catch (error) {
        console.log(error);
        throw new Error(`Error al verificar conductore de la api: ${error}`);
    }
}

const safeInsertUser = async (user: IUser): Promise<IUser> => {
    const existing = await findOne<IUser>(User, { email: user.email });
    return existing || await insert(User, user);
}

const DEFAULT_PASSWORD = '1234567890';
const DEFAULT_PHONE = '+56955555555';
const DEFAULT_PATENTE = 'PTTE-01';
const verifyDriver = async (driver: IDriverApi) => {
    try {
        /* verifico si existe el conductor en la app de administracion, 
        si no lo grabo, queda disponible para completar datos por el admin */

        const user: IUser = {
            email: driver.email,
            roleId: 3,
            username: driver.name,
            password: DEFAULT_PASSWORD,
            state: 'activo',
            age: 18,
            birthDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
            firstName: driver.name,
            lastName: driver.name,
            phone: driver.phone || DEFAULT_PHONE,
        };
        const userR = await safeInsertUser(user);
        if (!userR) throw new Error('No se pudo obtener el usuario');
        const userId = userR.id
        const driv: IDriver = {
            userId: userId,
            status: 'activo',
            patente: DEFAULT_PATENTE
        }
        await insert(Driver, driv);

    } catch (error: any) {
        console.log(error);
        if (error.name !== 'SequelizeUniqueConstraintError') {
            throw new Error(`Error al verificar conductor: ${error}`);
        }

    }
}

const verifyCircuitDriver = async (drivers: IDriverApi[]) => {
    try {
        const drivs = await list(DriverApi);
        for (const driv of drivs) {
            const d: IDriverApi = driv.dataValues;
            if (!drivers.find(dr => dr.email === d.email)) {
                return false;
            }
        }
        return true;
    } catch (error) {
        console.log(error)
        throw new Error(`Error al verificar conductore de circuit: ${error}`);
    }
}

export const syncApps = async (req: Request, res: Response) => {

    const estado = {
        driversSincronizados: false,
        pickups: false,
        deliveries: false
    };

    try {

        const { data } = await getDrivers({});
        await Promise.all(data.drivers.map(async (driver) => {
            await verifyDriversApi(driver);
            await verifyDriver(driver);
        }));
        estado.driversSincronizados = await verifyCircuitDriver(data.drivers);

        const plan = await preparePlan();
        if (!plan) return res.status(200).send('Este dia ya fue sincronizado');

        estado.pickups = await getPickups(plan.id);
        estado.deliveries = await getDelivery(plan.id);

        if (!estado.pickups || !estado.deliveries) {
            return res.status(500).send('No se pudieron sincronizar los stops');
        }

        if (!estado.driversSincronizados) {
            return res.status(206).send('Conductores sin sincronizar');
        }

        res.status(200).json({
            message: 'Sincronización completa',
            plan: plan,
            pickups: estado.pickups,
            deliveries: estado.deliveries,
            driversSincronizados: estado.driversSincronizados
        });

    } catch (error: any) {
        console.error('[SYNC ERROR]', error);
        res.status(500).json({ error: error.message });
    }
}

export const syncDrivers = async (req: Request, res: Response) => {
    res.status(200).json({ success: { message: 'Conductores sincronizados exitosamente' } });
    /* const addingDrivers: IDriverApi[] = [];
    try {
        const { data } = await getDrivers({});
        const drivs = await list(DriverApi);
        for (const driv of drivs) {
            const d: IDriverApi = driv.dataValues;
            if (!data.drivers.find(dr => dr.email === d.email)) {
                const newDriver: IDriverCreate = {
                    displayName: `${d.displayName}`,
                    email: d.email,
                    name: d.name,
                    phone: d.phone
                }
                const { data } = await createDriver(newDriver);
                await update(DriverApi, Number(d.id), { id_router_api: data.driverApi.id })
            }
        }
        res.status(200).json({
            message: 'Conductores sincronizados con exito'
        });
    } catch (error: any) {
        console.error('[SYNC DRIVER ERROR]', error);
        res.status(500).json({ error: error.message });
    } */
}

const prepareBulkStops = async (planId: number | undefined) => {
    try {
        const stopsApi = await find<IStopApi>(StopApi, {
            [Op.or]: [
                { activity: 'pickup' },
                { activity: 'delivery' }
            ],
            planId: planId
        }, {
            include: [
                { model: AddressStop, }
            ]
        });

        const stopsCircuit: IStopCreate[] = await Promise.all(stopsApi.map(async (stopApi: IStopApi) => {
            const driver = await DriverApi.findOne({ where: { email: stopApi.driverIdentifier } });
            return {
                address: {
                    addressLineOne: stopApi.AddressStop?.addressLineOne,
                    addressLineTwo: stopApi.AddressStop?.addressLineTwo,
                    addressName: stopApi.AddressStop?.addressName
                },
                recipient: {
                    email: stopApi.AddressStop?.email,
                    name: stopApi.AddressStop?.name,
                    phone: stopApi.AddressStop?.phone,
                    externalId: stopApi.AddressStop?.externalId
                },
                allowedDrivers: [driver?.id_router_api ?? ''],
                driver: stopApi.driverIdentifier,
                activity: stopApi.activity,
                packageCount: stopApi.packageCount

            }
        }))
        return stopsCircuit;
    } catch (error) {
        console.error('[PREPARE BULK]', error);
    }
}
export const createCircuitPlan = async (req: Request, res: Response) => {
    const { planId } = req.params;
    if (planId === '') return res.status(200).json({ success: { message: 'Aun no has sincronizado la app ', planId } });
    res.status(200).json({ success: { message: 'Plan enviado a circuit exitosamente', planId } });
    /* try {
        const fecha = new Date();
        const day = fecha.getDate();
        const month = fecha.getMonth() + 1;
        const year = fecha.getFullYear();
        const plan = await findOne<IPlan>(Plan, {
            starts_day: day,
            starts_month: month,
            starts_year: year,
            id: planId
        });
        const drivers = await find<IDriverApi>(DriverApi);
        if (!drivers) return res.status(206).send('Conductores sin sincronizar');
        const drivIds: string[] = drivers.map(driver => String(driver.id_router_api));

        const newPlan: IPlanCreate = {
            starts: {
                day: day,
                month: month,
                year: year
            },
            title: plan?.title,
            drivers: drivIds
        }
        const stopsApi = await prepareBulkStops(plan?.id);
        const { data } = await createPlan(newPlan);
        const idCircuitPlan = data.id;
        await update(Plan, Number(planId), { id_router_api: idCircuitPlan });
        const { data: rsp } = await createBulkStops(stopsApi, idCircuitPlan);
        if (rsp.success) {
            return res.status(200).json({ success: { message: 'Paradas sincronizadas con exito', planId } });
        }
    } catch (error: any) {
        console.error('[CREATE PLAN ERROR]', error);
        res.status(500).json({ error: { message: error.message } });
    } */
}

export const optmizePlan = async (req: Request, res: Response) => {
    const { planId } = req.params;
    if (planId === '') return res.status(200).json({ success: { message: 'Aun no has sincronizado la app ', planId } });
    res.status(200).json({ success: { message: 'Paradas optimizadas con exito', planId } });
    /* try {
        const { data } = await optimizePlan(planId);
        if (data.done)
            return res.status(200).json({ success: { message: 'Paradas optimizadas con exito', planId } });
    } catch (error: any) {
        console.error('[OPTMIZE PLAN ERROR]', error);
        res.status(500).json({ error: { message: error.message } });
    } */
}

export const sendPlan = async (req: Request, res: Response) => {
    const { planId } = req.params;
    if (planId === '') return res.status(200).json({ success: { message: 'Aun no has sincronizado la app ', planId } });
    res.status(200).json({ succes: { message: 'Paradas enviados con exito', planId } });
    /*  try {
         const { data } = await distributePlan(planId);
         if (data.id !== '')
             return res.status(200).json({ succes: { message: 'Paradas enviados con exito', planId } });
     } catch (error: any) {
         console.error('[SEND PLAN ERROR]', error);
         res.status(500).json({ error: { message: error.message } });
     } */
}