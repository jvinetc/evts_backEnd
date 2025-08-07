import { Request, Response, NextFunction } from "express";
import { now } from "mongoose";
import bcrypt from 'bcrypt';

const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const registerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = now();
    const { firstName, lastName, email, age, password, phone, username } = req.body;
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
            return res
                .status(400)
                .json({
                    message: "Los campos deben estar completos y ser texto válido",
                });
        }

        if (isNaN(Number(age))) {
            return res.status(400).json({ message: "La edad debe ser numérica" });
        }

        if (Number(age) < 18) {
            return res
                .status(400)
                .json({ message: "Para ingresar debe ser mayor de edad" });
        }

        if (!emailFormat.test(email)) {
            return res
                .status(400)
                .json({ message: "El correo no posee un formato correcto" });
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
    const { id, firstName, lastName, email, age, password, phone, username } = req.body;
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
            !phone ||
            typeof phone !== "string" ||
            !phone.trim() ||
            !username ||
            typeof username !== "string" ||
            !username.trim()
        ) {
            return res
                .status(400)
                .json({
                    message: "Los campos deben estar completos y ser texto válido",
                });
        }

        if (isNaN(Number(age))) {
            return res.status(400).json({ message: "La edad debe ser numérica" });
        }

        if (Number(age) < 18) {
            return res
                .status(400)
                .json({ message: "Para ingresar debe ser mayor de edad" });
        }

        if (!emailFormat.test(email)) {
            return res
                .status(400)
                .json({ message: "El correo no posee un formato correcto" });
        }

        if (password) {
            passCrypt = bcrypt.hashSync(password, 10);
            req.body = {
                id,
                firstName,
                lastName,
                email,
                age: Number(age),
                username,
                password: passCrypt,
                phone,
                updateAt: date,
            };
        } else {
            req.body = {
                id,
                firstName,
                lastName,
                email,
                age: Number(age),
                username,
                phone,
                state,
                updateAt: date,
            };
        }




        next();
    } catch (error) {
        return res
            .status(500)
            .json({ origin: "middleware", message: error });
    }
};