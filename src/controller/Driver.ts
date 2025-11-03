import { Request, Response } from "express";
import { Driver, Comuna, User, Stop, PickUp, Failed } from "../models";
import { create, update, list, byField, byFieldWithRelations, oneByFieldWithRelations, listWithRelations } from "./crudController";
import { IDriver, StatsDriver } from "../interface/Driver";
import { Op, Sequelize, WhereOptions } from "sequelize";
import { IUser } from "../interface/User";
import * as fs from 'fs';
import { cloudinary } from "../util/cloudinary";

export const createDriver = async (req: Request, res: Response) => {
    const user: IUser = JSON.parse(req.body.user);
    const driver: IDriver = JSON.parse(req.body.driver);
    const files = req.files as Express.Multer.File[];
    const { expiration1, expiration2, expiration3 } = req.body;
    user.roleId = 3;
    user.username = `${user.firstName}${user.lastName}`;
    user.password = '1234567890';
    user.state = 'activo';
    const userR = await create(User, user);
    if (!userR || !files || files.length === 0) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    driver.userId = userR.dataValues.id;
    driver.liceciaConducir = files[0].filename;
    driver.urlLiceciaConducir = files[0].path;
    driver.permisoCirculacion = files[1].filename;
    driver.urlPermisoCirculacion = files[1].path;
    driver.revicionTecnica = files[2].filename;
    driver.urlRevicionTecnica = files[2].path;
    driver.vencimientoLiceciaConducir = expiration1;
    driver.vencimientoPermisoCirculacion = expiration2;
    driver.vencimientoRevicionTecnica = expiration3;
    driver.status = 'activo';
    const driverR = await create(Driver, driver);
    const comunaId = driver.Comunas?.map(c => Number(c.id));
    await driverR?.setComunas(comunaId);
    if (!driverR) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json({ driver: driverR, user: userR });
}

export const updateDriver = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user: IUser = req.body.user && JSON.parse(req.body.user);
    const driver: IDriver = req.body.driver && JSON.parse(req.body.driver);
    const files = req.files as {
        [key: string]: Express.Multer.File[];
    };
    const { expiration1, expiration2, expiration3 } = req.body;
    try {
        if (user) {
            await update(User, { id: user.id }, user);
        }
        const driverR = await byField(Driver, { id: id });
        const driv = driverR?.dataValues;
        if (driver) {
            /* await update(Driver, { id: driver.id }, driver); */
            const comunaId = driver.Comunas?.map(c => Number(c.id));
            await driverR?.setComunas(comunaId);
        }
        // Licencia de conducir
        if (driver.patente) {
            driv.patente = driver.patente;
        }
        if (files.file1 && expiration1) {
            cloudinary.uploader.destroy(driv.liceciaConducir);
            driv.liceciaConducir = files.file1[0].filename;
            driv.urlLiceciaConducir = files.file1[0].path;
            driv.vencimientoLiceciaConducir = expiration1;
        }

        // Permiso de circulación
        if (files.file2 && expiration2) {
            cloudinary.uploader.destroy(driv.permisoCirculacion);
            driv.permisoCirculacion = files.file2[0].filename;
            driv.urlPermisoCirculacion = files.file2[0].path;
            driv.vencimientoPermisoCirculacion = expiration2;
        }

        // Revisión técnica
        if (files.file3 && expiration3) {
            cloudinary.uploader.destroy(driv.revicionTecnica);
            driv.revicionTecnica = files.file3[0].filename;
            driv.urlRevicionTecnica = files.file3[0].path;
            driv.vencimientoRevicionTecnica = expiration3;
        }

        await update(Driver, { id: id }, driv);

        res.status(200).json({ user, driv });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'no fue posible actualizar, revisa la consola' })
    }


}

export const disableDriver = async (req: Request, res: Response) => {

    const driverB = await byField(Driver, { id: req.body.id });
    const driv = driverB?.dataValues;
    fs.unlink(`./uploads/${driv.revicionTecnica}`, error => {
        if (error) {
            console.log("Archivo no borrado revicion tecnica: ", error)
        } else {
            console.log("archivo eliminado revicion tecnica: ", driv.revicionTecnica);
        }
    });
    fs.unlink(`./uploads/${driv.permisoCirculacion}`, error => {
        if (error) {
            console.log("Archivo no borrado permiso de circulacion: ", error)
        } else {
            console.log("archivo eliminado permiso de circulacion: ", driv.permisoCirculacion);
        }
    });
    fs.unlink(`./uploads/${driv.liceciaConducir}`, error => {
        if (error) {
            console.log("Archivo no borrado licencia de conducir: ", error)
        } else {
            console.log("archivo eliminado licencia de conducir: ", driv.liceciaConducir);
        }
    });
    const driver = await update(Driver, { id: req.body.id }, { status: "inactive" });
    if (!driver) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    res.status(201).json(driver);
}

interface FilterQuery {
    limit?: number;
    page?: number;
    order?: string;
    search?: string;
    comunaId?: number;
}

export const getDrivers = async (req: Request<{}, {}, {}, FilterQuery>, res: Response) => {
    const { order, search, comunaId } = req.query;
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const offset = page ? (page - 1) * limit : 0;
    const [field, direction] = order ? order.split('_') : 'id_ASC'.split('_');
    const field2 = field === "creation" ? 'createAt' : field;
    let filter: WhereOptions = {};
    if (search && search.trim()) {
        filter[Op.or] = [
            { patente: { [Op.iLike]: `${search}%` } },
            { '$User.firstName$': { [Op.iLike]: `${search}%` } },
            { '$User.lastName$': { [Op.iLike]: `${search}%` } }
        ];
    }

    if (comunaId) {
        filter['$Comunas.id$'] = Number(req.query.comunaId);
    }

    try {
        const { rows: drivers, count } = await Driver.findAndCountAll({
            where: filter,
            limit: limit,
            offset: offset,
            distinct: true,
            order: [[field2, direction]],
            include: [
                { model: User, attributes: ['firstName', 'lastName', 'id', 'email'], required: !!search },
                { model: Comuna, attributes: ['name', 'id'], required: !!comunaId },
            ]
        });

        const stats: StatsDriver[] = [];
        for (const driver of drivers) {
            const driverStats = await getStatsDriverById(driver.dataValues.id!);
            stats.push(driverStats);
        }

        res.json({ drivers, count, stats });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

const getStatsDriverById = async (driverId: number): Promise<StatsDriver> => {
  try {
    const stats: StatsDriver = {
      monthDelivery: 0,
      monthPickup: 0,
      monthFailed: 0,
      historicalDelivery: 0,
      historicalPickup: 0,
      historicalFailed: 0
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    /* HISTÓRICO */
    const stopsDelivered = await Stop.findOne({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'value']],
      where: { driverId, status: 'delivered' },
      raw: true
    }) as { value: string | number | null } | null;
    stats.historicalDelivery = stopsDelivered?.value ? Number(stopsDelivered.value) : 0;

    const stopsFailed = await Failed.findOne({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'value']],
      where: { driverId },
      raw: true
    }) as { value: string | number | null } | null;
    stats.historicalFailed = stopsFailed?.value ? Number(stopsFailed.value) : 0;

    const stopsPickups = await PickUp.findOne({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'value']],
      where: { driverId },
      raw: true
    }) as { value: string | number | null } | null;
    stats.historicalPickup = stopsPickups?.value ? Number(stopsPickups.value) : 0;

    /* MENSUAL */
    const monthDelivered = await Stop.findOne({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'value']],
      where: {
        driverId,
        status: 'delivered',
        updateAt: {
          [Sequelize.Op.gte]: startOfMonth,
          [Sequelize.Op.lt]: endOfMonth
        }
      },
      raw: true
    }) as { value: string | number | null } | null;
    stats.monthDelivery = monthDelivered?.value ? Number(monthDelivered.value) : 0;

    const monthFailed = await Failed.findOne({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'value']],
      where: {
        driverId,
        failedDate: {
          [Sequelize.Op.gte]: startOfMonth,
          [Sequelize.Op.lt]: endOfMonth
        }
      },
      raw: true
    }) as { value: string | number | null } | null;
    stats.monthFailed = monthFailed?.value ? Number(monthFailed.value) : 0;

    const monthPickup = await PickUp.findOne({
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'value']],
      where: {
        driverId,
        createAt: {
          [Sequelize.Op.gte]: startOfMonth,
          [Sequelize.Op.lt]: endOfMonth
        }
      },
      raw: true
    }) as { value: string | number | null } | null;
    stats.monthPickup = monthPickup?.value ? Number(monthPickup.value) : 0;

    return stats;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching driver stats');
  }
};


export const getDriverById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const driver = await oneByFieldWithRelations(Driver, { id }, [
        { model: Comuna, attributes: ['name', 'id'] },
        { model: User, attributes: ['firstName', 'lastName', 'id', 'email', 'phone', 'birthDate'] }
    ]);
    if (!driver) {
        res.status(500).json({ message: ' no existen registros' });
    }
    res.status(200).json(driver);
}

export const getDriverDeliveredChart = async (req: Request, res: Response) => {
    const drivers = await listWithRelations(Driver, {
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('Stops.id')), 'value'], // Conteo de IDs
            [Sequelize.col('User.firstName'), 'label']
        ],
        group: ['User.firstName'],
        raw: true // Devuelve resultados como objetos planos
    },
        [{
            model: Stop, attributes: [],
            where: { status: 'delivered' },
            required: true
        },
        {
            model: User, attributes: [],
            required: true
        }]);
    if (!drivers) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    const datosLimpios = drivers.map(({ label, value }) => ({
        value,
        label
    }));
    res.status(200).json(datosLimpios);
}