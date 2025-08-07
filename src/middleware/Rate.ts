import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'TemporaryKey';

export const createRateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;
    const { nameService, price } = req.body;
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
            !nameService ||
            typeof nameService !== "string" ||
            !nameService.trim()
        ) {
            return res
                .status(400)
                .json({
                    message: "El servicio debe tener un nombre de referencia",
                });
        }

        if (isNaN(Number(price))) {
            return res.status(400).json({ message: "El precio debe ser numérica" });
        }

        req.body = {
            nameService,
            price
        };

        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};

export const updateRateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;
    const { id, nameService, price } = req.body;
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
            !nameService ||
            typeof nameService !== "string" ||
            !nameService.trim()
        ) {
            return res
                .status(400)
                .json({
                    message: "El servicio debe tener un nombre de referencia",
                });
        }

        if (isNaN(Number(price))) {
            return res.status(400).json({ message: "El precio debe ser numérica" });
        }

        req.body = {
            id,
            nameService,
            price,
            updateAt:date
        };

        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};