//import { create, update, list, byField } from "./crudController";
import { Role } from "../models/Role";
import { Request, Response } from "express";
import { list } from "./crudController";

export const setRole = async (req: Request, res: Response) => {
    try {
        const resp = await Role.bulkCreate(req.body);
        res.status(201).json(resp);
    } catch (error) {
        res.status(500).json({message:"El registro no pudo ser creado", error});
    }    
}

export const listRoles = async (req: Request, res: Response) => {
    try {
        const resp = await list(Role);
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({message:"El registro no pudo ser creado", error});
    } 
}