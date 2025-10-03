import { create, update, list, byField, byFieldWithRelations, oneByFieldWithRelations } from "./crudController";
import { User, Role, Images, Sell } from "../models";
import { Request, Response } from "express";
import crypto from 'crypto';
import { sendRecoveryMail, sendVerificationEmail } from "../util/mailer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { ICreateAdmin, IUser } from "../interface/User";
import { ISell } from "../interface/Sell";



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
        await sendVerificationEmail(String(user.email), token);
        res.status(201).json({ message: `Usuario registrado con exito, se envio un emial de verificacion a ${user.email}.` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}

export const createUSer = async (req: Request<{}, {}, ICreateAdmin, {}>, res: Response) => {
    const { addres, age, birthDate, comunaId, email, firstName, lastName, pass, phone, sellName, username } = req.body;
    const passCrypt = bcrypt.hashSync(pass, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const roles = await list(Role);
    const getRol = roles.find(rol => rol.dataValues.name === "admin");
    let roleId: number = 0;
    let userId: number = 0;
    if (getRol)
        roleId = getRol.dataValues.id;

    const newUser: IUser = {
        age: Number(age),
        birthDate,
        email,
        firstName,
        lastName,
        password: passCrypt,
        phone,
        username,
        state: 'activo',
        roleId,
        verification_token: token,
    }
    const user = await create(User, newUser)
    if (user)
        userId = user.dataValues.id;
    const newSell: ISell = {
        userId,
        comunaId: Number(comunaId),
        addres,
        addresPickup: addres,
        name: sellName,
        email,
        state: 'activo'
    }
    const sell = await create(Sell, newSell);
    if (!user || !sell) {
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
        return;
    }
    sendVerificationEmail(email, token);
    res.status(201).json({message:'admin creado con exito'});
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
            { model: Images, attributes: ['name', 'url'] },
            { model: Sell, attributes: ['id', 'addresPickup', 'name', 'email', 'addres'] }
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
        console.log(error);
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
    const user: IUser = req.body;
    try {
        console.log('user:', user);
        let us;
        if (user.password && user.password !== '') {
            user.password = bcrypt.hashSync(user.password, 10);
            us = await update(User, { id: user.id }, user);
        } else {
            const { password, ...safeUSer } = user;
            us = await update(User, { id: user.id }, safeUSer);
        }

        if (!us) {
            res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
            return;
        }
        const userReturn = await byFieldWithRelations(User, { id: user.id }, [
            { model: Role, attributes: ['name'] },
            { model: Images, attributes: ['name', 'url'] },
            { model: Sell, attributes: ['id', 'addresPickup', 'name', 'email', 'addres'] }
        ])
        res.status(200).json(userReturn);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
    }
}

export const recoveryPass = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        let password = generateRandomPassword();
        password = bcrypt.hashSync(password, 10);
        const user = await update(User, { email: email }, { password: password });
        if (!user) {
            console.log("no existe el usuario");
            res.status(206).json({ message: `El correo ${email} no esta registrado` });
        }
        sendRecoveryMail(email, password);
        res.status(200).json({ message: `Se envio un mensaje a ${email} con los pasos a seguir` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'no fue posible guardar, revisa la consola' })
    }
}

const generateRandomPassword = (length = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};