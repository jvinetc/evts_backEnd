import express,{ Router } from "express";
import { webHookCircuit } from "../controller"

const router = Router();

router.post('/', express.raw({ type: '*/*' }), webHookCircuit);

export default router;