import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const phoneFormat = /^\+56\s?9\d{8}$|^569\d{8}$/i;
const secret = process.env.JWT_SECRET || 'TemporaryKey';

export const createStopMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const { addresName, addres, comunaId, notes, sellId, rateId, phone, lat, lng, fragile, devolution,exchange } = req.body;
    const url = req.url;

    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;

    console.log(
        `Fecha de la consulta: ${date}; URL consultada: ${url}; Datos recibidas: `,
        req.body
    );

    try {
        if (!token) {
            return res
                .status(400)
                .json({
                    message: "Usuario no autorizado",
                });
        }

        if (!jwt.verify(token, secret)) {
            return res
                .status(400)
                .json({
                    message: "El token enviado no corresponde a esta sesion",
                });
        }

        if (
            !addresName ||
            typeof addresName !== "string" ||
            !addresName.trim() ||
            !addres ||
            typeof addres !== "string" ||
            !addres.trim() ||
            !phone ||
            typeof phone !== "string" ||
            !phone.trim()
        ) {
            return res
                .status(400)
                .json({
                    message: "Los campos deben estar completos y ser texto válido",
                });
        }

        if (!phoneFormat.test(phone.trim())) {
            return res
                .status(400)
                .json({
                    message: "El formato del telefono es incorrecto",
                });
        }

        req.body = {
            addresName,
            addres,
            comunaId,
            notes,
            sellId,
            rateId,
            phone,
            lat,
            lng,
            fragile,
            devolution,
            exchange
        };

        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};

export const updateStopMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const { id, addresName, addres, comunaId, notes, sellId, rateId, phone, lat, lng } = req.body;
    const url = req.url;

    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;

    console.log(
        `Fecha de la consulta: ${date}; URL consultada: ${url}; Datos recibidas: `,
        req.body
    );

    try {
        if (!token) {
            return res
                .status(400)
                .json({
                    message: "Usuario no autorizado",
                });
        }

        if (!jwt.verify(token, secret)) {
            return res
                .status(400)
                .json({
                    message: "El token enviado no corresponde a esta sesion",
                });
        }

        if (
            !addresName ||
            typeof addresName !== "string" ||
            !addresName.trim() ||
            !addres ||
            typeof addres !== "string" ||
            !addres.trim() ||
            !phone ||
            typeof phone !== "string" ||
            !phone.trim()
        ) {
            return res
                .status(400)
                .json({
                    message: "Los campos deben estar completos y ser texto válido",
                });
        }

        if (!phoneFormat.test(phone)) {
            return res
                .status(400)
                .json({
                    message: "El formato del telefono es incorrecto",
                });
        }

        req.body = {
            id,
            addresName,
            addres,
            comunaId,
            notes,
            sellId,
            rateId,
            updateAt: date,
            lat,
            lng
        };

        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};

export const fromExcel = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const body = req.body;
    const url = req.url;

    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;

    console.log(
        `Fecha de la consulta: ${date}; URL consultada: ${url}; Datos recibidas: `,
        req.body
    );

    try {
        if (!token) {
            return res
                .status(400)
                .json({
                    message: "Usuario no autorizado",
                });
        }

        if (!jwt.verify(token, secret)) {
            return res
                .status(400)
                .json({
                    message: "El token enviado no corresponde a esta sesion",
                });
        }
        if (!body) {
            return res
                .status(400)
                .json({
                    message: "No viene contenido en tu archivo",
                });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }

}

export const toExcelBuffer = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const url = req.url;


    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;

    console.log(
        `Fecha de la consulta: ${date}; URL consultada: ${url}; Datos recibidas: `,
        req.body
    );

    try {
        if (!token) {
            res
                .status(400)
                .json({
                    message: "Usuario no autorizado",
                });
            console.log("No token provided");
            return;
        }

        if (!jwt.verify(token, secret)) {
            res
                .status(400)
                .json({
                    message: "El token enviado no corresponde a esta sesion",
                });
            console.log("Invalid token");
            return;
        }


        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }

}