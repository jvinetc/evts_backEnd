import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'TemporaryKey';

export const createSellMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;
    const { name, userId, comunaId, addres, addresPickup, lat, lng, email } = req.body;
    const url = req.url;

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
            !name ||
            typeof name !== "string" ||
            !name.trim() ||
            !addresPickup ||
            typeof addresPickup !== "string" ||
            !addresPickup.trim()
        ) {
            return res
                .status(400)
                .json({
                    message: "Todos los campos son requeridos",
                });
        }

        req.body = {
            name,
            userId,
            comunaId,
            addres,
            addresPickup,
            state: 'activo',
            lat,
            lng, 
            email
        };

        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};

export const updateSellMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;
    const { id, name, userId, comunaId, addres, addresPickup, lat, lng } = req.body;
    const url = req.url;

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
            !name ||
            typeof name !== "string" ||
            !name.trim() ||
            !addresPickup ||
            typeof addresPickup !== "string" ||
            !addresPickup.trim()
        ) {
            return res
                .status(400)
                .json({
                    message: "Todos los campos son requeridos",
                });
        }

        req.body = {
            id,
            name,
            userId,
            comunaId,
            addres,
            addresPickup,
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