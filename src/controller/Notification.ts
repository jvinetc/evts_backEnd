import { Request, Response } from "express";
import { INotification } from "../interface/Notification";
import { create, list, update } from "./crudController";
import { Notification, User } from "../models";
import { io } from "../util/createSocket";
import { Expo } from 'expo-server-sdk';
const expo = new Expo();


export const createNotification = async ({ title, message, read, type, sellId, userId, orderBuy }: INotification) => {
    const not = await create(Notification, { title, message, read, type, sellId, userId, orderBuy });
    if (!not && !type) {
        console.log(not);
        return false;
    }
    io.emit(type ?? '', { newNotification: true })
    return true;
}

export const getNotificationAdmin = async (req: Request, res: Response) => {
    const notifications = await list(Notification, { where: { type: 'admin' }, order: [['id', 'DESC']], });
    if (!notifications) {
        res.status(500).json({ message: "error al cargar las notificaciones" })
    }
    res.status(200).json(notifications);
}

export const getNotificationClient = async (req: Request, res: Response) => {
    const { id } = req.params;
    const notifications = await list(Notification, { where: { type: 'client', sellId: id }, order: [['id', 'DESC']], });
    if (!notifications) {
        res.status(500).json({ message: "error al cargar las notificaciones" })
    }
    res.status(200).json(notifications);
}

export const markToRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    const notifications = await update(Notification, { id: id }, { read: true });
    if (!notifications) {
        res.status(500).json({ message: "error al cargar las notificaciones" })
    }
    io.emit('client', { newNotification: true })
    res.status(200).json(notifications);
}

export const getNotRead = async (req: Request, res: Response) => {
    try {
        const response = await Notification.findAll
            ({ where: { read: false, type: 'admin' }, order: [['id', 'DESC']], });
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }
}

export const getNotReadC = async (req: Request, res: Response) => {
    const { sellId } = req.params;
    try {
        const response = await Notification.findAll
            ({ where: { read: false, type: 'client', sellId }, order: [['id', 'DESC']], });
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }
}

export const asignNotification = ({ }) => {

}

export const sendPushNotification = async (expoPushToken: string, title: string, body: string) => {
    if (!Expo.isExpoPushToken(expoPushToken)) return;

    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: { type: 'pago', timestamp: Date.now() },
    };

    const chunks = expo.chunkPushNotifications([message]);
    for (const chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
    }
};

export const saveExpoToken = async (req: Request, res: Response) => {
    const { userId, expoToken } = req.body;
    if (!userId || !expoToken) return res.status(400).json({ error: 'Datos incompletos' });

    await User.update({ expoPushToken: expoToken }, { where: { id: userId } });
    res.json({ success: true });
}