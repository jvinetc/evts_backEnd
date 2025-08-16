import { Request, Response } from "express";
import { create, update, list, byField, byFieldWithRelations } from "./crudController";
import { Images } from "../models";
import * as fs from 'fs';

export const createImageUser = async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    const user_id = req.params.id;
    if (!file) {
        console.log('no hay archivo');
        res.status(400).json({ message: 'Por favor, elige un archivo' });
        return;
    }
    try {
        const userImage = await byField(Images, { userId: user_id });
        if (userImage) {
            const fileName = userImage.dataValues.name;
            fs.unlink(`./uploads/${fileName}`, error => {
                if (error) {
                    console.log("Archivo no borrado por: ", error)
                } else {
                    console.log("archivo eliminado de: ", fileName);
                }
            });
            await Images.destroy({ where: { userId: user_id } });
        }
        const data = {
            name: file.filename,
            userId: user_id
        }
        const image = await create(Images, data);
        res.status(201).json({ message: 'archivos guadados correctamente', image });
    } catch (error) {
        res.status(500).json({ message: error })
    }
}