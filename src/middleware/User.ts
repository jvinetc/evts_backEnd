import { Request, Response, NextFunction } from "express";
import { now } from "mongoose";
import bcrypt from 'bcrypt';

const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const registerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = now();
    const { firstName, lastName, email, age, password, phone, username, birthDate } = req.body;
    const url = req.url;
    let passCrypt;
    let state;

    console.log(
        `Fecha de la consulta: ${new Date()}; URL consultada: ${url}; Datos recibidas: `,
        req.body
    );

    try {
        if (
            !firstName ||
            typeof firstName !== "string" ||
            !firstName.trim() ||
            !lastName ||
            typeof lastName !== "string" ||
            !lastName.trim() ||
            !email ||
            typeof email !== "string" ||
            !email.trim() ||
            !password ||
            typeof password !== "string" ||
            !password.trim() ||
            !phone ||
            typeof phone !== "string" ||
            !phone.trim() ||
            !username ||
            typeof username !== "string" ||
            !username.trim()
        ) {
            console.log('datos incompletos');
            res
                .status(400)
                .json({
                    message: "Los campos deben estar completos y ser texto válido",
                });
            return;
        }

        if (isNaN(Number(age))) {
            console.log('la edad no es numero');
            res.status(400).json({ message: "La edad debe ser numérica" });
            return;
        }

        if (Number(age) < 18) {
            console.log('menor de edad');
            res
                .status(400)
                .json({ message: "Para ingresar debe ser mayor de edad" });
            return;
        }

        if (!emailFormat.test(email)) {
            console.log('mal fromato de correo');
            res
                .status(400)
                .json({ message: "El correo no posee un formato correcto" });
            return;
        }

        passCrypt = bcrypt.hashSync(password, 10);
        state = "inactivo";

        req.body = {
            firstName,
            lastName,
            email,
            age: Number(age),
            username,
            password: passCrypt,
            phone,
            state,
            birthDate,
            registration_date: date,
        };

        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};

export const loginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const url = req.url;
    console.log(
        `Fecha de la consulta: ${new Date()}; URL consultada: ${url};`
    );

    try {
        if (
            !email ||
            typeof email !== "string" ||
            !email.trim() ||
            !password ||
            typeof password !== "string" ||
            !password.trim()
        ) {
            return res
                .status(400)
                .json({ message: "Los campos no deben estar vacíos" });
        }

        if (!emailFormat.test(email)) {
            return res
                .status(400)
                .json({ message: "El formato de correo es erróneo" });
        }
        req.body = {
            email,
            pass: password,
        };

        next();
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

export const updateUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = now();
    const { id, firstName, lastName, email, age, password, phone, birthDate, username } = req.body;
    const url = req.url;
    let passCrypt;

    console.log(
        `Fecha de la consulta: ${new Date()}; URL consultada: ${url}; Datos recibidas: `,
        req.body
    );

    try {
        if (
            !firstName ||
            typeof firstName !== "string" ||
            !firstName.trim() ||
            !lastName ||
            typeof lastName !== "string" ||
            !lastName.trim() ||
            !email ||
            typeof email !== "string" ||
            !email.trim() ||
            !phone ||
            typeof phone !== "string" ||
            !phone.trim() ||
            !username ||
            typeof username !== "string" ||
            !username.trim()
        ) {
            res
                .status(400)
                .json({
                    message: "Los campos deben estar completos y ser texto válido",
                });
            console.log('campos vacios');
            return;
        }

        if (isNaN(Number(age))) {
            res.status(400).json({ message: "La edad debe ser numérica" });
            console.log('error de edad');
            return
        }

        if (Number(age) < 18) {
            res
                .status(400)
                .json({ message: "Para ingresar debe ser mayor de edad" });
            console.log('menor de edad');
            return;
        }

        if (!emailFormat.test(email)) {
            res
                .status(400)
                .json({ message: "El correo no posee un formato correcto" });
            console.log('correo invalido');
            return;
        }
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};