import { Request, Response } from "express";
import { Driver, Comuna, User } from "../models";
import { create, update, list, byField, byFieldWithRelations, oneByFieldWithRelations } from "./crudController";
import { IDriver } from "../interface/Driver";
import { Op, WhereOptions } from "sequelize";
import { IUser } from "../interface/User";
import * as fs from 'fs';

export const createDriver = async (req: Request, res: Response) => {
    const user: IUser = JSON.parse(req.body.user);
    const driver: IDriver = JSON.parse(req.body.driver);
    const files = req.files;
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
    driver.permisoCirculacion = files[1].filename;
    driver.revicionTecnica = files[2].filename;
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
            await update(Driver, { id: driver.id }, driver);
            const comunaId = driver.Comunas?.map(c => Number(c.id));
            await driverR?.setComunas(comunaId);
        }
        // Licencia de conducir
        if (files.file1 && expiration1) {
            fs.unlink(`./uploads/${driv.liceciaConducir}`, (error) => {
                if (error) console.log("Error al eliminar licencia:", error);
                else console.log("Licencia eliminada:", driv.liceciaConducir);
            });
            driv.liceciaConducir = files.file1[0].filename;
            driv.vencimientoLiceciaConducir = expiration1;
        }

        // Permiso de circulación
        if (files.file2 && expiration2) {
            fs.unlink(`./uploads/${driv.permisoCirculacion}`, (error) => {
                if (error) console.log("Error al eliminar permiso:", error);
                else console.log("Permiso eliminado:", driv.permisoCirculacion);
            });
            driv.permisoCirculacion = files.file2[0].filename;
            driv.vencimientoPermisoCirculacion = expiration2;
        }

        // Revisión técnica
        if (files.file3 && expiration3) {
            fs.unlink(`./uploads/${driv.revicionTecnica}`, (error) => {
                if (error) console.log("Error al eliminar revisión:", error);
                else console.log("Revisión eliminada:", driv.revicionTecnica);
            });
            driv.revicionTecnica = files.file3[0].filename;
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
            order: [[field2, direction]],
            include: [
                { model: User, attributes: ['firstName', 'lastName', 'id'], required: !!search },
                { model: Comuna, attributes: ['name', 'id'], required: !!comunaId },
            ]
        });

        res.json({ drivers, count });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

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