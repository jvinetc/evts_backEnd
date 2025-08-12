import { create, update, list, byField, byFieldWithRelations, oneByFieldWithRelations } from "./crudController";
import { User, Role, Images, Sell } from "../models";
import { Request, Response } from "express";
import crypto from 'crypto';
import { sendVerificationEmail } from "../util/mailer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { IUser } from "../interface/User";



export const registerUser = async (req: Request<{}, {}, IUser, {}>, res: Response) => {
    const user = req.body;
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const roles = await list(Role);
        const getRol = roles.find(rol => rol.dataValues.name === "client");
        if (getRol)
            user.roleId = getRol.dataValues.id;
        user.verification_token = token;
        const data = await create(User, user);
        await sendVerificationEmail(user.email, token);
        res.status(201).json({ message: `Usuario registrado con exito, se envio un emial de verificacion a ${user.email}.` });
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

export const createUSer = async (req: Request, res: Response) => {
    const newUser = req.body;
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    newUser.state = 'activo';
    const user = await create(User, newUser);
    if (!user) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    const { password, ...userWithoutPass } = user.dataValues;
    res.status(201).json(userWithoutPass);
}

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users = await list(User);
        const safeUSers = users.forEach(user => {
            const { password, ...userWithoutPass } = user.dataValues;
            return {
                user: userWithoutPass
            }
        });
        res.status(200).json(safeUSers);
    } catch (error) {
        res.status(500).json({ message: "Los registrosno pueden ser listados", error });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, pass } = req.body;
    const secret = process.env.JWT_SECRET || 'TemporaryKey';
    try {
        const user = await oneByFieldWithRelations(User, { email: email }, [
            { model: Role, attributes: ['name'] },
            { model: Images, attributes: ['name'] },
            { model: Sell, attributes: ['id', 'addresPickup', 'name'] }
        ])
        if (!user) {
            return res.status(400).json({ message: "Usuario inexistente" });
        }
        if (user.dataValues.state !== "activo") {
            return res.status(401).json({ message: "Verifica tu correo antes de iniciar sesion" });
        }
        const isLogged = bcrypt.compareSync(pass, user.dataValues.password.toString());
        if (!isLogged) {
            return res
                .status(400)
                .json({ message: "Usuario o contraseña incorrectos" });
        }
        const token = jwt.sign({ id: user.dataValues.id, email: user.dataValues.email }, secret);
        const { password, ...userWithoutPass } = user.dataValues;

        res.json({ token, user: userWithoutPass });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const verify = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const users = await byField(User, { verification_token: token });
        if (!users) return res.status(404).send("Token inválido.");
        const user = Array.isArray(users) ? users[0] : users;
        user.state = "activo";
        user.verification_token = null;
        await user.save();
        fs.readFile('./src/util/verify.html', (err, data) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            res.end(data);
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export const disableUser = async (req: Request, res: Response) => {
    const driver = await update(User, { id: req.body.id }, { state: "inactive" });
    if (!driver) {
        res.status(500).json({ message: 'no fue posible actualizar, revisa la consola' })
        return;
    }
    res.status(201).json(driver);
}

export const updateUser = async (req: Request, res: Response) => {
    const user = await update(User, { id: req.body.id }, req.body);
    if (!user) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    const userReturn = await byFieldWithRelations(User, { id: req.body.id }, [
            { model: Role, attributes: ['name'] },
            { model: Images, attributes: ['name'] },            
            { model: Sell, attributes: ['id'] }
        ])
    res.status(200).json(userReturn);
}