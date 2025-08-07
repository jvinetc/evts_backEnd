import { create, update, list, byField } from "./crudController";
import { Comuna } from "../models";
import { Request, Response } from "express";

export const setComuna = async (req: Request, res: Response) => {
    try {
        const resp = await Comuna.bulkCreate(req.body);
        res.status(201).json(resp);
    } catch (error) {
        res.status(500).json({message:"El registro no pudo ser creado", error});
    }    
}

export const listComunas = async (req: Request, res: Response) => {
    try {
        const resp = await list(Comuna);
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({message:"El registro no pudo ser creado", error});
    } 
}