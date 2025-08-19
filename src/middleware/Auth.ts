import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'TemporaryKey';

export const authConfirm = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const Authorization = req.header("Authorization");
    const token = Authorization ? Authorization.split("Bearer ")[1] : false;
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
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
}