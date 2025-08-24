import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const pathPatente = /^[A-Z]{2,3}-\d{4}$/;
const secret = process.env.JWT_SECRET || 'TemporaryKey';

export const createDriverMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;
    const user = JSON.parse(req.body.user);
    const driver = JSON.parse(req.body.driver);
    const files = req.files;
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

        if (!user || !driver || !files) {
            return res
                .status(400)
                .json({
                    message: "Todos los campos son obligatorios",
                });
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};

export const updateDriverMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();

    //const { id, userId, patente, docs, comunas } = req.body;
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
        next();
       /*  if (
            !patente ||
            typeof patente !== "string" ||
            !patente.trim()
        ) {
            return res
                .status(400)
                .json({
                    message: "La patente es obligatoria",
                });
        }

        if (docs.length > 2) {
            return res
                .status(400)
                .json({
                    message: "Todos los documentos son requeridos",
                });
        }

        if (!comunas.length) {
            return res
                .status(400)
                .json({
                    message: "Debe asignar una comuna como minimo",
                });
        }

        if (!pathPatente.test(patente.toUpperCase())) {
            return res
                .status(400)
                .json({
                    message: "El formato de la patente no es el correcto",
                });
        }

        req.body = {
            id,
            userId,
            patente,
            permisoCirculacion: docs[0],
            revicionTecnica: docs[1],
            liceciaConducir: docs[2],
            comunas: [comunas],
            updateAt: date
        };

        next(); */
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};